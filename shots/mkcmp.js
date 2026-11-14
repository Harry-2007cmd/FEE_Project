const fs = require("fs");
const dir = __dirname;

function wrap(refFile, reactFile, title, refDims) {
  const ref = fs.readFileSync(refFile);
  const react = fs.readFileSync(reactFile);
  return `<!doctype html><html><head><meta charset=utf-8></head>
<body style="margin:0;background:#111;font-family:system-ui,sans-serif;color:#eee;padding:24px">
<h2 style="margin:0 0 4px">${title}</h2>
<p style="margin:0 0 18px;opacity:.7">${refDims}</p>
<div style="display:flex;gap:24px;flex-wrap:wrap;justify-content:center">
<div style="background:#fff;border-radius:8px;padding:8px"><img style="width:900px;height:auto;max-width:100%" src="data:image/png;base64,${ref.toString("base64")}"></div>
<div style="background:#fff;border-radius:8px;padding:8px"><img style="width:900px;height:auto;max-width:100%" src="data:image/png;base64,${react.toString("base64")}"></div>
</div>
<p style="margin:24px 0 0;opacity:.7">Right = React migration build</p>
</body></html>`;
}

const args = process.argv.slice(2);
const [ref, react, title, dims] = args;
fs.writeFileSync(dir + "/_compare.html", wrap(ref, react, title, dims));
console.log("wrote _compare.html");