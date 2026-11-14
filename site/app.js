const orderEl = document.getElementById("order");
const groupsEl = document.getElementById("groups");
const countsEl = document.getElementById("counts");
const notesEl = document.getElementById("form-notes");
const pickEl = document.getElementById("form-pick");
const sourceEl = document.getElementById("source-list");
const previewEl = document.getElementById("preview");
const copyStatus = document.getElementById("copy-status");

const RANK = { required: 0, required_unless_single: 1, expected: 2, conditional: 3, optional: 4, skip: 5 };
const LABEL = {
  required: "Required",
  required_unless_single: "Required unless single name",
  expected: "Worth filling (not marked required)",
  conditional: "Only if it applies",
  optional: "Optional",
  skip: "Skip (office use)"
};

let forms = [];
let current = null;

function tagFor(req) {
  const cls = req === "required_unless_single" ? "required" : req === "expected" ? "conditional" : req;
  return `<span class="tag ${cls}">${LABEL[req] || req}</span>`;
}

function fillOrder(fields) {
  const work = fields.filter((f) => f.required !== "skip").slice();
  work.sort((a, b) => {
    const d = RANK[a.required] - RANK[b.required];
    if (d !== 0) return d;
    return 0;
  });
  return work;
}

function render(form) {
  current = form;
  const order = fillOrder(form.fields);
  const req = form.fields.filter((f) => f.required === "required" || f.required === "required_unless_single").length;
  const opt = form.fields.filter((f) => f.required === "optional").length;
  const exp = form.fields.filter((f) => f.required === "expected").length;
  const cond = form.fields.filter((f) => f.required === "conditional").length;
  const skip = form.fields.filter((f) => f.required === "skip").length;
  const skipLabel = skip === 1 ? "1 office-use box to skip" : `${skip} office-use boxes to skip`;
  countsEl.textContent = `${form.title} (${form.form_code}). ${req} required, ${exp} worth filling though not marked required, ${opt} optional, ${cond} only if they apply, ${skipLabel}.`;
  notesEl.hidden = false;
  notesEl.innerHTML = form.notes.map((n) => `<p>${n}</p>`).join("");
  orderEl.innerHTML = order
    .map(
      (f, i) =>
        `<li><span class="meta">Step ${i + 1}</span> ${tagFor(f.required)} <strong>${f.name}</strong>
         <div class="hint">${f.why}${f.tip ? " " + f.tip : ""}</div></li>`
    )
    .join("");
  const sections = [];
  for (const f of form.fields) {
    if (!sections.includes(f.section)) sections.push(f.section);
  }
  groupsEl.innerHTML = sections
    .map((s) => {
      const rows = form.fields
        .filter((f) => f.section === s)
        .map((f) => `<li>${tagFor(f.required)} <strong>${f.name}</strong><div class="hint">${f.why}</div></li>`)
        .join("");
      return `<h3>${s}</h3><ul class="clean">${rows}</ul>`;
    })
    .join("");
  sourceEl.innerHTML = `
    <li><a href="${form.source_url}">${form.source_name}</a></li>
    <li>Guide: <a href="${form.guide_url}">${form.guide_url}</a></li>
    <li>${form.source_checked}</li>`;
}

function orderPlain(form) {
  const order = fillOrder(form.fields);
  const lines = [
    form.title,
    form.form_code,
    "Source: " + form.source_url,
    ""
  ];
  order.forEach((f, i) => {
    lines.push(`${i + 1}. [${LABEL[f.required]}] ${f.name}`);
    lines.push("   " + f.why);
  });
  return lines.join("\n");
}

async function init() {
  const res = await fetch("data/forms.json");
  if (!res.ok) {
    countsEl.textContent = "Could not load the field list. Serve this folder over HTTP and try again.";
    return;
  }
  const data = await res.json();
  forms = data.forms;
  pickEl.innerHTML = forms.map((f) => `<option value="${f.id}">${f.short}</option>`).join("");
  pickEl.addEventListener("change", () => {
    render(forms.find((f) => f.id === pickEl.value));
  });
  document.getElementById("shot").addEventListener("change", (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) {
      previewEl.hidden = true;
      previewEl.removeAttribute("src");
      return;
    }
    const url = URL.createObjectURL(file);
    previewEl.src = url;
    previewEl.hidden = false;
  });
  document.getElementById("copy-order").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(orderPlain(current));
      copyStatus.textContent = "Fill order copied.";
    } catch (err) {
      copyStatus.textContent = "Copy failed. You can select the list and copy it yourself.";
    }
  });
  render(forms[0]);
}

init();
