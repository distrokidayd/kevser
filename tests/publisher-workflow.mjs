import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {pathToFileURL} from "node:url";
const {PGlite}=await import(process.env.PGLITE_PATH?pathToFileURL(process.env.PGLITE_PATH).href:"@electric-sql/pglite");
const pg=new PGlite();
try {
  await pg.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create table profiles(id text primary key,email text,role text default 'user',is_publisher boolean default false,publisher_status text);
    create table publisher_applications(id uuid primary key default gen_random_uuid(),user_id text not null,full_name text not null,email text not null,phone text,experience text,reason text,status text,admin_decision text,admin_decided_by text,admin_decided_at timestamptz,created_at timestamptz default now());
    create table platform_settings(key text primary key,value text);
    create table user_notifications(id uuid default gen_random_uuid(),user_id text,title text,message text,type text);
    grant usage on schema public to service_role,anon,authenticated;
    grant select,insert,update on all tables in schema public to service_role;
    insert into platform_settings values('publisher_agreement','Sözleşme A');
  `);
  await pg.exec(await readFile(new URL("../supabase/migrations/202611270001_publisher_workflow.sql",import.meta.url),"utf8"));
  await pg.exec("set role service_role");
  const submit=async(member,agreement="Sözleşme A")=>(await pg.query(
    "select kevser_submit_publisher($1,$2::jsonb,$3,$4) as id",
    [member,JSON.stringify({fullName:"Test Üyesi",email:"test@example.invalid",reason:"Eser çalışması",agreement}),"YWJj","audio/mpeg"])).rows[0].id;
  const review=(id,decision)=>pg.query("select kevser_review_publisher($1,'admin',$2,'Karar notu')",[id,decision]);
  const id=await submit("uye1");
  assert.equal(await submit("uye1"),id);
  assert.equal((await pg.query("select encode(audio_bytes,'base64') as audio from publisher_acceptances")).rows[0].audio,"YWJj");
  await review(id,"approve");await review(id,"approve");
  assert.equal((await pg.query("select is_publisher from profiles where id='uye1'")).rows[0].is_publisher,true);
  assert.equal((await pg.query("select count(*)::int as n from user_notifications")).rows[0].n,1);
  await assert.rejects(review(id,"reject"));
  await assert.rejects(submit("uye2","Önceki sözleşme"));
  const second=await submit("uye2");await review(second,"reject");
  assert.equal((await pg.query("select publisher_status from profiles where id='uye2'")).rows[0].publisher_status,"rejected");
  assert.notEqual(await submit("uye2"),second);
  await pg.exec("reset role; set role anon");
  await assert.rejects(submit("anon"));
  await assert.rejects(pg.query("select * from publisher_acceptances"));
  console.log("Başvuru, ses kaydı, tekrar gönderim, onay/ret, bildirim, yeniden başvuru ve anonim erişim testleri geçti.");
} finally {await pg.close()}
