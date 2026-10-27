// 这个文件负责把 data.js 里的内容画到页面上，一般不用改。
const $ = (s) => document.querySelector(s);

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const pad = (n) => String(n).padStart(2, "0");

// 没有封面时，按序号轮流用一种柔和的纯色（颜色在 style.css 的 --tone-1 ~ --tone-5）
const art = (i) => `var(--tone-${(i % 5) + 1})`;

function cover(p, i) {
  return p.cover
    ? `<div class="cover"><img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy"></div>`
    : `<div class="cover art" style="background:${art(i)}"><span>${pad(i + 1)}</span></div>`;
}

const tagList = (p) => (p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("");

// ---- 基本信息 ----
const year = new Date().getFullYear();
document.title = `${SITE.name} · 作品集`;
$("#logo").textContent = SITE.name;
$("#status").textContent = SITE.status;
$("#year-top").textContent = year;
$("#year").textContent = year;
$("#footer-name").textContent = SITE.name;
$("#hero-title").innerHTML = esc(SITE.title)
  .replace(/\*(.+?)\*/g, "<em>$1</em>")
  .replace(/\n/g, "<br>");
$("#hero-lead").textContent = SITE.lead;
$("#about-text").textContent = SITE.about;
$("#skills").innerHTML = SITE.skills.map((s) => `<li>${esc(s)}</li>`).join("");

$("#stats").innerHTML = [
  [PROJECTS.length, "个作品"],
  [SITE.skills.length, "项技能"],
  [SITE.since, "年起步"],
].map(([n, t]) => `<div><dt>${esc(n)}</dt><dd>${t}</dd></div>`).join("");

$("#contact-mail").href = `mailto:${SITE.email}`;
$("#contact-mail").innerHTML = `${esc(SITE.email)} <span class="arrow">↗</span>`;
$("#contact-links").innerHTML = SITE.contacts
  .map((c) => `<a class="btn" href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.label)} <span class="arrow">↗</span></a>`)
  .join("");

$("#timeline").innerHTML = JOURNEY.map(
  (j) => `<li class="reveal"><time class="mono">${esc(j.date)}</time><div><h3>${esc(j.title)}</h3><p>${esc(j.text || "")}</p></div></li>`
).join("");

const words = SITE.skills.map((s) => `<span>${esc(s)}</span><b>·</b>`).join("");
$("#marquee").innerHTML = words.repeat(4);

// ---- 作品卡片 + 筛选 ----
const tags = ["全部", ...new Set(PROJECTS.flatMap((p) => p.tags || []))];
let current = "全部";

function renderFilters() {
  $("#filters").innerHTML = tags
    .map((t) => `<button class="chip${t === current ? " active" : ""}" data-tag="${esc(t)}">${esc(t)}</button>`)
    .join("");
}

function renderGrid() {
  const list = PROJECTS.map((p, i) => ({ p, i })).filter(
    ({ p }) => current === "全部" || (p.tags || []).includes(current)
  );
  $("#grid").innerHTML = list
    .map(
      ({ p, i }) => `
      <article class="card${p.featured ? " featured" : ""}" data-i="${i}" tabindex="0">
        ${cover(p, i)}
        <div class="card-body">
          <div class="meta mono"><span>${esc(p.date || "")}</span>${tagList(p)}</div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.summary || "")}</p>
        </div>
        <span class="card-arrow">→</span>
      </article>`
    )
    .join("");
  $("#empty").hidden = list.length > 0;
}

$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  current = b.dataset.tag;
  renderFilters();
  renderGrid();
});

// ---- 详情抽屉 ----
const drawer = $("#drawer");
function openCard(i) {
  const p = PROJECTS[i];
  const links = [
    p.demo && `<a class="btn primary" href="${esc(p.demo)}" target="_blank" rel="noopener">在线预览 <span class="arrow">↗</span></a>`,
    p.code && `<a class="btn" href="${esc(p.code)}" target="_blank" rel="noopener">源代码 <span class="arrow">↗</span></a>`,
  ].filter(Boolean).join("");
  $("#drawer-body").innerHTML = `
    ${cover(p, i)}
    <div class="drawer-text">
      <div class="meta mono"><span>${pad(i + 1)} — ${esc(p.date || "")}</span>${tagList(p)}</div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.details || p.summary || "")}</p>
      <div class="actions">${links}</div>
    </div>`;
  drawer.showModal();
}
$("#grid").addEventListener("click", (e) => {
  const c = e.target.closest(".card");
  if (c) openCard(+c.dataset.i);
});
$("#grid").addEventListener("keydown", (e) => {
  const c = e.target.closest(".card");
  if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openCard(+c.dataset.i); }
});
$("#drawer-close").addEventListener("click", () => drawer.close());
drawer.addEventListener("click", (e) => { if (e.target === drawer) drawer.close(); });

// ---- 深浅色切换（记住你的选择）----
const root = document.documentElement;
try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch {}
$("#theme-toggle").addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
});

// ---- 滚动到哪里，哪里就淡入 ----
renderFilters();
renderGrid();
const io = new IntersectionObserver((entries) => {
  for (const en of entries) if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
