const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const JSZip = require("jszip");
const books = require("../app/lib/klasikler.json");
const folder = path.join(__dirname, "..", "public", "eserler");
const digest = bytes => crypto.createHash("sha256").update(bytes).digest("hex");

async function prepare(book) {
  const target = path.join(folder, book.id + ".epub");
  let bytes = await fs.readFile(target).catch(() => null);
  if (!bytes || digest(bytes) !== book.sha256) {
    const url = book.edition + "/latest/download/book.epub";
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(url, {signal: AbortSignal.timeout(60000)});
        if (!response.ok) throw Error(book.title + " HTTP " + response.status);
        bytes = Buffer.from(await response.arrayBuffer());
        if (digest(bytes) !== book.sha256) throw Error(book.title + " baskı özeti eşleşmedi.");
        break;
      } catch (error) {
        if (attempt === 3) throw error;
        await new Promise(resolve => setTimeout(resolve, attempt * 1500));
      }
    }
    await fs.writeFile(target, bytes);
  }
  const zip = await JSZip.loadAsync(bytes);
  const cover = zip.file(book.coverEntry);
  if (!cover) throw Error(book.title + " kapağı bulunamadı.");
  await fs.writeFile(path.join(folder, book.cover), await cover.async("nodebuffer"));
}
async function main() {
  await fs.mkdir(folder, {recursive:true});
  for (let i=0; i<books.length; i+=4) await Promise.all(books.slice(i,i+4).map(prepare));
  console.log(books.length + " doğrulanmış EPUB ve kapak dağıtıma hazır.");
}
main().catch(error => {console.error(error);process.exitCode=1});
