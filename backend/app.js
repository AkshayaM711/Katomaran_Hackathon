// backend/app.js  ← (create or overwrite)
const express    = require("express");
const cors       = require("cors");
const fs         = require("fs");
const path       = require("path");
const { spawn }  = require("child_process");
const bodyParser = require("body-parser");

const app  = express();
const PORT = 5000;
const DIR  = path.join(__dirname, "registered_faces");

fs.mkdirSync(DIR, { recursive: true });

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use("/registered_faces", express.static(DIR));   // serve saved PNGs

// ---------- 1) Save a new face ----------
app.post("/register", (req, res) => {
  const { image, name } = req.body;
  if (!image || !name) return res.status(400).json({ message: "image & name required" });

  const safe = name.trim().replace(/[^a-z0-9_-]/gi, "_");
  const data = image.replace(/^data:image\/\w+;base64,/, "");
  fs.writeFile(path.join(DIR, `${safe}.png`), Buffer.from(data, "base64"), (err) => {
    if (err) return res.status(500).json({ message: "save failed" });
    res.json({ message: `✅ saved as ${safe}.png` });
  });
});

// ---------- 2) List saved faces ----------
app.get("/faces", (_, res) => {
  fs.readdir(DIR, (e, f) => (e ? res.status(500).end() : res.json(f.filter((x)=>x.endsWith(".png")))));
});

// ---------- 3) Recognize in a frame ----------
app.post("/recognize", (req, res) => {
  const py = spawn("python", [path.join(__dirname, "..", "recognize.py")]);

  let out = "";
  py.stdout.on("data", (d)=> out += d);
  py.stderr.on("data",  (d)=> console.error(d.toString()));
  py.on("close", () => {
    try { res.json(JSON.parse(out || "[]")); }
    catch { res.status(500).end(); }
  });

  py.stdin.write(JSON.stringify({ image: req.body.image }));
  py.stdin.end();
});

app.listen(PORT, () => console.log(`🚀 backend on http://localhost:${PORT}`));
