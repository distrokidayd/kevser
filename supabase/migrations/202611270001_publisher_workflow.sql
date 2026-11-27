-- Server routes authenticate through Clerk and operate with service_role.
begin;
alter table public.publisher_applications add column if not exists website text,
  add column if not exists social_links text, add column if not exists admin_note text;
alter table public.publisher_applications enable row level security;
alter table public.profiles enable row level security;
alter table public.user_notifications enable row level security;

create table public.publisher_acceptances (
  application_id uuid primary key references public.publisher_applications(id),
  agreement_text text not null,
  audio_type text not null,
  audio_bytes bytea not null check (octet_length(audio_bytes) between 1 and 3145728),
  accepted_at timestamptz not null default now()
);
alter table public.publisher_acceptances enable row level security;
revoke all on public.publisher_acceptances from anon, authenticated;
grant select, insert on public.publisher_acceptances to service_role;

create function public.kevser_submit_publisher(member text, form jsonb, audio text, mime text)
returns uuid language plpgsql security invoker set search_path = public, pg_temp as $$
declare
  existing_id uuid;
  agreement text;
begin
  perform pg_advisory_xact_lock(hashtextextended(member, 0));
  select id into existing_id from publisher_applications
    where user_id=member and status='pending' order by created_at desc limit 1;
  if existing_id is not null then return existing_id; end if;
  if exists(select from profiles where id=member and (is_publisher or role='publisher')) then
    raise exception 'Yayıncı erişimi zaten açık.' using errcode='P0001';
  end if;
  select coalesce(nullif(value,''),'Kevser Yayın Evi platform kurallarını kabul ediyorum.') into agreement
    from platform_settings where key='publisher_agreement';
  agreement:=coalesce(agreement,'Kevser Yayın Evi platform kurallarını kabul ediyorum.');
  if form->>'agreement' is distinct from agreement then
    raise exception 'Sözleşme güncellendi. Sayfayı yenileyip yeni metni inceleyin.';
  end if;
  insert into publisher_applications(user_id,full_name,email,phone,website,social_links,experience,reason,status)
    values(member,form->>'fullName',form->>'email',form->>'phone',form->>'website',
      form->>'socialLinks',form->>'experience',form->>'reason','pending') returning id into existing_id;
  insert into publisher_acceptances(application_id,agreement_text,audio_type,audio_bytes)
    values(existing_id,agreement,mime,decode(audio,'base64'));
  insert into profiles(id,email,publisher_status) values(member,form->>'email','pending')
    on conflict(id) do update set publisher_status='pending';
  return existing_id;
end $$;

create function public.kevser_review_publisher(application uuid, reviewer text, decision text, note text)
returns text language plpgsql security invoker set search_path = public, pg_temp as $$
declare
  record_row publisher_applications%rowtype;
  outcome text;
begin
  if decision not in ('approve','reject') or decision is null then raise exception 'Geçersiz karar.'; end if;
  outcome:=case when decision='approve' then 'approved' else 'rejected' end;
  select * into strict record_row from publisher_applications where id=application;
  perform pg_advisory_xact_lock(hashtextextended(record_row.user_id, 0));
  select * into strict record_row from publisher_applications where id=application for update;
  if record_row.status=outcome then return outcome; end if;
  if record_row.status is distinct from 'pending' then raise exception 'Bu başvuru daha önce sonuçlandırıldı.'; end if;
  update publisher_applications set status=outcome,admin_decision=decision,admin_decided_by=reviewer,
    admin_decided_at=now(),admin_note=note where id=application;
  insert into profiles(id,email,is_publisher,publisher_status) values(record_row.user_id,record_row.email,decision='approve',outcome)
    on conflict(id) do update set is_publisher=excluded.is_publisher,publisher_status=excluded.publisher_status;
  insert into user_notifications(user_id,title,message,type) values(record_row.user_id,'Yayıncı Başvurusu',
    case when decision='approve' then 'Yayıncı başvurunuz onaylandı. Stüdyoya girebilirsiniz.'
         else 'Başvurunuz reddedildi. '||coalesce(note,'') end,'publisher');
  return outcome;
end $$;
revoke all on function public.kevser_submit_publisher(text,jsonb,text,text), public.kevser_review_publisher(uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.kevser_submit_publisher(text,jsonb,text,text), public.kevser_review_publisher(uuid,text,text,text) to service_role;
commit;
