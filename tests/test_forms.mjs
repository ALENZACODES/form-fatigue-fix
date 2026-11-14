import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "site/data/forms.json"), "utf8"));

let failed = 0;
function eq(name, a, b) {
  if (a !== b) {
    failed += 1;
    console.error("FAIL", name, "got", a, "expected", b);
  } else console.log("ok", name);
}

eq("two forms", data.forms.length, 2);
const foi = data.forms.find((f) => f.id === "toronto-foi");
const n9 = data.forms.find((f) => f.id === "ltb-n9");
eq("foi pdf url", foi.source_url.includes("FOIRequestForm"), true);
eq("n9 pdf url", n9.source_url.includes("N9.pdf"), true);
eq("foi signature required", foi.fields.find((f) => f.id === "signature").required, "required");
eq("foi fee required", foi.fields.find((f) => f.id === "fee").required, "required");
eq("foi division optional", foi.fields.find((f) => f.id === "division").required, "optional");
eq("foi office skip", foi.fields.find((f) => f.id === "office").required, "skip");
eq("n9 landlord required", n9.fields.find((f) => f.id === "landlord").required, "required");
eq("n9 delivery skip", n9.fields.find((f) => f.id === "delivery").required, "skip");

eq("foi phone not claimed required", foi.fields.find((f) => f.id === "phone").required, "expected");
eq("foi postal not claimed required", foi.fields.find((f) => f.id === "postal").required, "expected");
const app = readFileSync(join(root, "site/app.js"), "utf8");
for (const f of data.forms) for (const x of f.fields) {
  if (!new RegExp("\\b" + x.required + ":").test(app)) { failed += 1; console.error("FAIL unknown label", x.required); }
}
console.log("ok every label is known to the page");
const fill = (fields) => fields.filter((f) => f.required !== "skip");
eq("foi fill list omits office", fill(foi.fields).some((f) => f.id === "office"), false);
eq("n9 fill list omits delivery", fill(n9.fields).some((f) => f.id === "delivery"), false);
eq("foi has required fields", foi.fields.some((f) => f.required === "required"), true);

const banned = /\u2014|\u2013/;
const blob = JSON.stringify(data);
eq("no long dashes in data", banned.test(blob), false);

if (failed) {
  console.error(failed, "failed");
  process.exit(1);
}
console.log("all form tests passed");
