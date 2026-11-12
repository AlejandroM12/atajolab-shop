import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const params = new URLSearchParams(location.search);
const ID = params.get("s") || "p-001";
const W = +(params.get("w") || 800), H = +(params.get("h") || 600);
const FRAMES = +(params.get("n") || 28);
const QR_URL = "https://atajolab.dev";
const FONT = '"Segoe UI", Arial, sans-serif';

/* ---------- renderer / scene ---------- */
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(2);
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf4f4f0);
scene.fog = new THREE.Fog(0xf4f4f0, 90, 330);
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.5;

const key = new THREE.DirectionalLight(0xfff4e8, 3.1);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.bias = -0.0004;
key.shadow.normalBias = 0.03;
const sc = key.shadow.camera;
sc.left = -30; sc.right = 30; sc.top = 30; sc.bottom = -30; sc.near = 1; sc.far = 120;
scene.add(key, key.target);
const fill = new THREE.DirectionalLight(0xe8f0ff, 0.5);
fill.position.set(14, 10, 18);
scene.add(fill);

/* ---------- helpers ---------- */
const tex = (w, h, draw) => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d");
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 16;
  return t;
};
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };

function qr(g, x, y, size, fg = "#111", bg = "#fff", quiet = true) {
  const q = qrcode(0, "M"); q.addData(QR_URL); q.make();
  const n = q.getModuleCount();
  const pad = quiet ? 2 : 0;
  const c = size / (n + pad * 2);
  g.fillStyle = bg; g.fillRect(x, y, size, size);
  g.fillStyle = fg;
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++)
    if (q.isDark(r, k)) g.fillRect(Math.round(x + (k + pad) * c), Math.round(y + (r + pad) * c), Math.ceil(c), Math.ceil(c));
}
function contactless(g, cx, cy, s, color = "#111", lw) {
  g.strokeStyle = color; g.lineCap = "round"; g.lineWidth = lw || s * 0.12;
  for (let i = 0; i < 4; i++) {
    const r = s * (0.28 + i * 0.26);
    g.beginPath(); g.arc(cx - s * 0.55, cy, r, -0.62, 0.62); g.stroke();
  }
}
function star(g, cx, cy, r, color) {
  g.fillStyle = color; g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? r * 0.45 : r;
    g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  g.closePath(); g.fill();
}
const text = (g, t, x, y, size, weight = 600, color = "#111", align = "left") => {
  g.font = `${weight} ${size}px ${FONT}`; g.fillStyle = color; g.textAlign = align; g.textBaseline = "alphabetic";
  g.fillText(t, x, y);
};
function logoBox(g, x, y, w, h, color = "#111", label = "TU LOGO") {
  g.strokeStyle = color; g.lineWidth = Math.max(2, h * 0.05); g.setLineDash([h * 0.12, h * 0.08]);
  rr(g, x, y, w, h, h * 0.18); g.stroke(); g.setLineDash([]);
  text(g, label, x + w / 2, y + h * 0.64, h * 0.36, 700, color, "center");
}

/* ---------- print designs (return CanvasTexture, transparent rounded corners) ---------- */
function printDesign(kind, o = {}) {
  const A = o.accent || "#ff6a13";
  const aspect = o.aspect || 0.75;
  const Wp = aspect >= 1 ? 1400 : Math.round(1400 * aspect), Hp = aspect >= 1 ? Math.round(1400 / aspect) : 1400;
  return tex(Wp, Hp, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.save(); rr(g, 0, 0, w, h, o.radius ?? w * 0.04); g.clip();
    g.fillStyle = o.bg || "#fff"; g.fillRect(0, 0, w, h);
    if (kind === "review") {
      if (aspect < 1) { // vertical
        if (o.dark) { g.fillStyle = "#14213d"; g.fillRect(0, 0, w, h); }
        logoBox(g, w * 0.34, h * 0.06, w * 0.32, h * 0.07, o.dark ? "#fff" : "#111");
        text(g, "Dejanos", w / 2, h * 0.255, w * 0.15, 800, o.dark ? "#fff" : "#111", "center");
        text(g, "tu reseña", w / 2, h * 0.255 + w * 0.16, w * 0.15, 800, A, "center");
        for (let i = 0; i < 5; i++) star(g, w * (0.2 + i * 0.15), h * 0.43, w * 0.065, "#f5b301");
        qr(g, w * 0.24, h * 0.485, w * 0.52, "#111", "#fff");
        text(g, "Escaneá el código", w / 2, h * 0.905, w * 0.062, 600, o.dark ? "#e6e6e6" : "#333", "center");
        if (o.nfc) { contactless(g, w * 0.43, h * 0.955, w * 0.045, o.dark ? "#fff" : "#111"); text(g, "o acercá tu celular", w * 0.57, h * 0.963, w * 0.05, 500, o.dark ? "#e6e6e6" : "#333", "center"); }
      } else { // horizontal
        const dk = !!o.dark; const fg = dk ? "#fff" : "#111";
        if (dk) { g.fillStyle = "#14213d"; g.fillRect(0, 0, w, h); }
        logoBox(g, w * 0.05, h * 0.08, w * 0.14, h * 0.13, fg);
        text(g, "Tu opinión", w * 0.05, h * 0.5, h * 0.105, 800, fg);
        text(g, "nos ayuda", w * 0.05, h * 0.5 + h * 0.125, h * 0.105, 800, A);
        for (let i = 0; i < 5; i++) star(g, w * 0.065 + i * h * 0.1, h * 0.82, h * 0.042, "#f5b301");
        const qs = Math.min(h * 0.74, w * 0.36); g.fillStyle = "#fff"; g.fillRect(w * 0.6, h * 0.08, qs, qs);
        qr(g, w * 0.6, h * 0.08, qs, "#111", "#fff");
        text(g, "Escaneá y dejá tu reseña", w * 0.6 + qs / 2, h * 0.08 + qs + h * 0.07, h * 0.036, 600, fg, "center");
      }
    } else if (kind === "menu") {
      const dark = o.dark !== false;
      g.fillStyle = dark ? "#171717" : "#fff"; g.fillRect(0, 0, w, h);
      const fg = dark ? "#fff" : "#111";
      logoBox(g, w * 0.36, h * 0.06, w * 0.28, h * 0.065, fg);
      text(g, "Nuestra carta", w / 2, h * 0.2, w * 0.11, 800, fg, "center");
      g.fillStyle = A; g.fillRect(w * 0.43, h * 0.235, w * 0.14, h * 0.008);
      g.fillStyle = "#fff"; rr(g, w * 0.17, h * 0.3, w * 0.66, w * 0.66, w * 0.03); g.fill();
      qr(g, w * 0.17, h * 0.3, w * 0.66, "#111", "#fff");
      text(g, "Escaneá y mirá el menú", w / 2, h * 0.3 + w * 0.66 + h * 0.07, w * 0.065, 600, fg, "center");
      if (o.nfc) { contactless(g, w * 0.39, h * 0.93, w * 0.05, fg); text(g, "o acercá tu celular", w * 0.58, h * 0.94, w * 0.05, 500, fg, "center"); }
    } else if (kind === "sticker") {
      g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
      if (o.nfc) {
        g.fillStyle = A; g.fillRect(0, 0, w, h);
        contactless(g, w * 0.55, h * 0.46, w * 0.2, "#fff", w * 0.028);
        text(g, "Acercá tu celular", w / 2, h * 0.84, w * 0.075, 700, "#fff", "center");
      } else {
        qr(g, w * 0.2, h * 0.1, w * 0.6, "#111", "#fff");
        text(g, o.cap || "Escaneá", w / 2, h * 0.86, w * 0.065, 800, "#111", "center");
        g.strokeStyle = A; g.lineWidth = w * 0.025; g.beginPath(); g.arc(w / 2, h / 2, w * 0.47, 0, 7); g.stroke();
      }
      if (o.nfc2) { /* nothing */ }
    } else if (kind === "stickerRect") {
      g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
      if (aspect >= 1) {
        qr(g, w * 0.04, h * 0.08, h * 0.84, "#111", "#fff");
        text(g, o.t1 || "Escaneá", w * 0.04 + h * 0.84 + w * 0.05, h * 0.42, h * 0.14, 800, "#111");
        text(g, o.t2 || "y conocé más", w * 0.04 + h * 0.84 + w * 0.05, h * 0.42 + h * 0.15, h * 0.085, 600, A);
        if (o.nfc) { contactless(g, w * 0.6, h * 0.84, h * 0.07, "#111"); text(g, "o acercá tu celular", w * 0.64, h * 0.865, h * 0.06, 500, "#333"); }
      } else {
        text(g, o.t1 || "Escaneá", w / 2, h * 0.15, w * 0.15, 800, "#111", "center");
        text(g, o.t2 || "y conocé más", w / 2, h * 0.15 + w * 0.15, w * 0.1, 600, A, "center");
        qr(g, w * 0.14, h * 0.3, w * 0.72, "#111", "#fff");
        if (o.nfc) { contactless(g, w * 0.4, h * 0.88, w * 0.08, "#111"); text(g, "o acercá tu celular", w * 0.62, h * 0.9, w * 0.055, 500, "#333", "center"); }
      }
    } else if (kind === "square") {
      g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
      qr(g, w * 0.1, h * 0.06, w * 0.8, "#111", "#fff");
      text(g, "Escaneá tu acceso", w / 2, h * 0.95, w * 0.075, 700, "#111", "center");
    } else if (kind === "cardContactBack") {
      g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
      text(g, "Nombre Apellido", w * 0.07, h * 0.3, h * 0.1, 800, "#111");
      text(g, "Tu cargo", w * 0.07, h * 0.3 + h * 0.11, h * 0.075, 500, "#555");
      g.fillStyle = A; g.fillRect(w * 0.07, h * 0.5, w * 0.1, h * 0.012);
      text(g, "tunegocio.com", w * 0.07, h * 0.8, h * 0.075, 500, "#333");
      qr(g, w * 0.62, h * 0.12, h * 0.76, "#111", "#fff");
    } else if (kind === "cardLogo") {
      g.fillStyle = o.bg || "#171717"; g.fillRect(0, 0, w, h);
      if (o.nfcIcon) contactless(g, w * 0.56, h * 0.5, h * 0.3, o.fg || "#fff", h * 0.034);
      else logoBox(g, w * 0.3, h * 0.36, w * 0.4, h * 0.28, o.fg || "#fff");
      if (o.nfcIcon) text(g, "Acercá tu celular", w / 2, h * 0.88, h * 0.075, 600, o.fg || "#fff", "center");
    } else if (kind === "cardQrNfc") {
      g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
      qr(g, w * 0.06, h * 0.12, h * 0.76, "#111", "#fff");
      contactless(g, w * 0.78, h * 0.42, h * 0.16, "#111", h * 0.022);
      text(g, "Escaneá o", w * 0.72, h * 0.72, h * 0.075, 700, "#111", "center");
      text(g, "acercá tu celular", w * 0.72, h * 0.72 + h * 0.085, h * 0.075, 500, A, "center");
    } else if (kind === "badge") {
      g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
      g.fillStyle = A; g.fillRect(0, 0, w, h * 0.17);
      text(g, "ACREDITACIÓN", w / 2, h * 0.11, w * 0.1, 800, "#fff", "center");
      logoBox(g, w * 0.3, h * 0.215, w * 0.4, h * 0.075);
      text(g, "Nombre", w / 2, h * 0.37, w * 0.1, 800, "#111", "center");
      text(g, "Apellido", w / 2, h * 0.37 + w * 0.11, w * 0.1, 800, "#111", "center");
      text(g, "Tipo de acceso", w / 2, h * 0.5, w * 0.06, 500, "#555", "center");
      qr(g, w * 0.2, h * 0.55, w * 0.6, "#111", "#fff");
    } else if (kind === "invite") {
      g.fillStyle = o.bg || "#faf8f4"; g.fillRect(0, 0, w, h);
      g.strokeStyle = "#111"; g.lineWidth = w * 0.006; g.strokeRect(w * 0.05, h * 0.035, w * 0.9, h * 0.93);
      text(g, "Estás invitado/a", w / 2, h * 0.2, w * 0.095, 800, "#111", "center");
      text(g, "Nombre del evento", w / 2, h * 0.27, w * 0.055, 500, "#555", "center");
      g.fillStyle = A; g.fillRect(w * 0.44, h * 0.31, w * 0.12, h * 0.006);
      qr(g, w * 0.2, h * 0.38, w * 0.6, "#111", "#faf8f4");
      text(g, "Presentá este código", w / 2, h * 0.86, w * 0.055, 600, "#111", "center");
      text(g, "en el ingreso", w / 2, h * 0.86 + w * 0.06, w * 0.055, 400, "#555", "center");
    } else if (kind === "tag") {
      g.fillStyle = "#111"; g.fillRect(0, 0, w, h);
      g.fillStyle = "#fff"; rr(g, w * 0.14, h * 0.3, w * 0.72, w * 0.72, w * 0.04); g.fill();
      qr(g, w * 0.14, h * 0.3, w * 0.72, "#111", "#fff");
      text(g, "Si me encontrás,", w / 2, h * 0.15, w * 0.085, 700, "#fff", "center");
      text(g, "escaneame", w / 2, h * 0.15 + w * 0.095, w * 0.085, 700, A, "center");
    } else if (kind === "phone") {
      g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
      text(g, "Carta", w * 0.08, h * 0.1, w * 0.12, 800, "#111");
      g.fillStyle = "#f1f1ef"; rr(g, w * 0.08, h * 0.14, w * 0.84, h * 0.06, w * 0.02); g.fill();
      ["Entradas", "Platos principales", "Postres", "Bebidas"].forEach((t, i) => {
        const y = h * (0.28 + i * 0.14);
        g.fillStyle = "#e7e7e4"; rr(g, w * 0.08, y, w * 0.26, h * 0.1, w * 0.02); g.fill();
        text(g, t, w * 0.38, y + h * 0.04, w * 0.075, 700, "#111");
        g.fillStyle = "#d4d4d0"; g.fillRect(w * 0.38, y + h * 0.065, w * 0.45, h * 0.009);
        g.fillRect(w * 0.38, y + h * 0.083, w * 0.3, h * 0.009);
      });
    } else if (kind === "strap") {
      g.fillStyle = o.bg || "#171717"; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 3; i++) text(g, "TU EVENTO", (i + 0.5) * (w / 3), h * 0.68, h * 0.42, 800, o.fg || "#fff", "center");
    } else if (kind === "antenna") {
      g.fillStyle = "#e9e9e6"; g.fillRect(0, 0, w, h);
      g.strokeStyle = "#b87333"; g.lineWidth = w * 0.012;
      for (let i = 0; i < 9; i++) { const m = w * (0.14 + i * 0.026); g.strokeRect(m, m, w - 2 * m, h - 2 * m); }
      g.fillStyle = "#2b2b2b"; g.fillRect(w * 0.44, h * 0.44, w * 0.12, h * 0.12);
    }
    g.restore();
    if (o.ringStroke) { g.strokeStyle = o.ringStroke; g.lineWidth = 6; }
  });
}

/* circular print: crop of a square canvas to a circle (transparent corners) */
function circleTex(kind, o) {
  const t = printDesign(kind, { ...o, aspect: 1, radius: 700 });
  return t;
}

/* ---------- materials ---------- */
const M = {
  acrylic: () => new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: 0.8, roughness: 0.03, ior: 1.49, specularIntensity: 1, envMapIntensity: 1.6, attenuationColor: new THREE.Color(0xdff7ee), attenuationDistance: 6, clearcoat: 1, clearcoatRoughness: 0.02 }),
  pvc: (c = 0xffffff) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.35 }),
  matte: (c = 0xffffff) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.82 }),
  metal: () => new THREE.MeshStandardMaterial({ color: 0xcfd2d6, metalness: 1, roughness: 0.28 }),
  print: (map, gloss = 0.25) => new THREE.MeshPhysicalMaterial({ map, transparent: true, alphaTest: 0.5, roughness: 0.5, clearcoat: gloss, clearcoatRoughness: 0.3 }),
};
const shadowAll = (o, cast = true, recv = true) => o.traverse((m) => { if (m.isMesh) { m.castShadow = cast && !m.userData.noShadow; m.receiveShadow = recv; } });
const plane = (w, h, map, gloss) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M.print(map, gloss)); m.castShadow = true; return m; };
const box = (w, h, d, r, mat) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), mat);

function stoneTexture() {
  return tex(1024, 1024, (g, w, h) => {
    g.fillStyle = "#cfcbc3"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 5000; i++) { g.fillStyle = `rgba(${Math.random() < 0.5 ? "255,255,255" : "90,86,78"},${Math.random() * 0.05})`; const r = 1 + Math.random() * 3; g.fillRect(Math.random() * w, Math.random() * h, r, r); }
  });
}

/* ---------- builders ---------- */
function acrylicStand({ w = 11, h = 15, design, tilt = -9 }) {
  const g = new THREE.Group();
  const base = box(w + 1.8, 1.3, 4.6, 0.3, M.acrylic()); base.position.y = 0.65; base.userData.noShadow = false;
  const pivot = new THREE.Group(); pivot.position.set(0, 1.0, 0.2); pivot.rotation.x = THREE.MathUtils.degToRad(tilt);
  const panel = box(w, h, 0.45, 0.18, M.acrylic()); panel.position.y = h / 2 - 0.2; panel.userData.noShadow = true;
  const pr = plane(w * 0.9, h * 0.9 * (w * 0.9 > 0 ? 1 : 1), design, 0.5); pr.position.set(0, h / 2 - 0.2, 0.235);
  pivot.add(panel, pr);
  const slot = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.1, 0.9), M.matte(0x2a2a2a)); slot.position.set(0, 1.28, 0.2);
  g.add(base, pivot, slot);
  return g;
}
function tent({ w = 10.5, h = 15, depth = 5, design, back = 0xf5f5f2 }) {
  const g = new THREE.Group();
  const ang = Math.atan(depth / h);
  const len = Math.hypot(h, depth);
  const front = new THREE.Group(); front.position.set(0, h, 0); front.rotation.x = -(Math.PI / 2 - Math.atan2(h, depth)) * 1; // lean
  // front panel: from apex down to +z
  const fp = new THREE.Group(); fp.position.set(0, h, 0); fp.rotation.x = -ang;
  const fb = box(w, len, 0.3, 0.1, M.matte(0xfbfbf9)); fb.position.y = -len / 2;
  const pr = plane(w * 0.94, len * 0.94, design, 0.1); pr.position.set(0, -len / 2, 0.16);
  fp.add(fb, pr);
  const bp = new THREE.Group(); bp.position.set(0, h, 0); bp.rotation.x = ang;
  const bb = box(w, len, 0.3, 0.1, M.matte(back)); bb.position.y = -len / 2; bp.add(bb);
  // panel front normal points +z; rotating by +ang about x moves bottom toward +z
  g.add(fp, bp);
  g.position.z = 0;
  return g;
}
function disc({ r = 3.5, design, thick = 0.05, gloss = 0.7 }) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, thick, 96), M.pvc(0xf8f8f6));
  const top = new THREE.Mesh(new THREE.CircleGeometry(r * 0.995, 96), new THREE.MeshPhysicalMaterial({ map: design, roughness: 0.35, clearcoat: gloss, clearcoatRoughness: 0.12 }));
  top.rotation.x = -Math.PI / 2; top.position.y = thick / 2 + 0.001;
  g.add(body, top); return g;
}
function card({ w = 8.56, h = 5.4, d = 0.1, body = 0xffffff, front, back, frontMatte = true }) {
  const g = new THREE.Group();
  const b = box(w, h, d, 0.12, M.pvc(body)); g.add(b);
  if (front) { const p = plane(w * 0.998, h * 0.998, front, 0.35); p.position.z = d / 2 + 0.002; g.add(p); }
  if (back) { const p = plane(w * 0.998, h * 0.998, back, 0.35); p.rotation.y = Math.PI; p.position.z = -d / 2 - 0.002; g.add(p); }
  return g;
}
function ribbon(points, width, map, up) {
  const curve = new THREE.CatmullRomCurve3(points);
  const N = 160, pos = [], uv = [], idx = [];
  const rep = Math.max(1, curve.getLength() / (width * 8));
  for (let i = 0; i <= N; i++) {
    const t = i / N, p = curve.getPoint(t), tg = curve.getTangent(t);
    const side = new THREE.Vector3().crossVectors(tg, up).normalize().multiplyScalar(width / 2);
    pos.push(p.x - side.x, p.y - side.y, p.z - side.z, p.x + side.x, p.y + side.y, p.z + side.z);
    uv.push(t * rep, 1, t * rep, 0);
    if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx); geo.computeVertexNormals();
  map.wrapS = THREE.RepeatWrapping;
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map, roughness: 0.6, side: THREE.DoubleSide }));
  m.castShadow = true; return m;
}
function clip() {
  const g = new THREE.Group();
  const a = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.3, 0.45), M.metal()); a.position.y = 0;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.12, 16, 40), M.metal()); ring.position.y = -1.6; ring.rotation.y = 0;
  g.add(a, ring); return g;
}
function glassPane({ w = 26, h = 34 }) {
  const g = new THREE.Group();
  const glass = new THREE.Mesh(new RoundedBoxGeometry(w, h, 1, 2, 0.12), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: 1, roughness: 0.02, ior: 1.52, attenuationColor: new THREE.Color(0xc6efe0), attenuationDistance: 14, envMapIntensity: 1.4 }));
  glass.position.y = h / 2; glass.userData.noShadow = true;
  const mk = (x, y, ww, hh) => { const m = new THREE.Mesh(new THREE.BoxGeometry(ww, hh, 1.4), new THREE.MeshStandardMaterial({ color: 0xb9bcc0, metalness: 0.9, roughness: 0.35 })); m.position.set(x, y, 0); return m; };
  g.add(glass, mk(0, 0.3, w + 1.2, 0.6), mk(0, h + 0.3, w + 1.2, 0.6), mk(-w / 2 - 0.3, h / 2 + 0.3, 0.6, h + 0.6), mk(w / 2 + 0.3, h / 2 + 0.3, 0.6, h + 0.6));
  return g;
}

/* ---------- scenes ---------- */
const floor = (color = 0xeeece8) => { const f = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color, roughness: 0.9 })); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; scene.add(f); return f; };
const table = () => { const f = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ map: stoneTexture(), roughness: 0.5 })); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; scene.add(f); scene.background = new THREE.Color(0xd9d5cd); scene.fog = new THREE.Fog(0xd9d5cd, 90, 330); return f; };
const wall = (z = -1, color = 0xe9e7e2) => { window.__noBlob = true; const w = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color, roughness: 0.95 })); w.position.z = z; w.receiveShadow = true; scene.add(w); return w; };

let cam = { pos: [26, 20, 40], target: [0, 6, 0], fov: 26 };
const blobTex = tex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, "rgba(0,0,0,0.38)"); gr.addColorStop(0.55, "rgba(0,0,0,0.14)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
const add = (o, x = 0, y = 0, z = 0, ry = 0, blob = true) => {
  o.position.set(x, y, z); o.rotation.y = ry; shadowAll(o); scene.add(o);
  if (blob && !window.__noBlob) { o.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(o); const sz = bb.getSize(new THREE.Vector3()), c = bb.getCenter(new THREE.Vector3()); if (bb.min.y < 1.5) { const b = new THREE.Mesh(new THREE.PlaneGeometry(sz.x * 1.5 + 2, sz.z * 1.5 + 2), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false })); b.rotation.x = -Math.PI / 2; b.position.set(c.x, 0.012, c.z); scene.add(b); } }
  return o;
};

const D = (k, o) => printDesign(k, o);
const rad = THREE.MathUtils.degToRad;

const SCENES = {
  /* Reseñas */
  "p-001": () => { floor(); add(acrylicStand({ design: D("review", { aspect: 0.75 }) }), 0, 0, 0, rad(-18)); cam = { pos: [20, 15, 44], target: [0, 6.5, 0], fov: 24, zoom: 1.0 }; },
  "p-002": () => { floor(); add(acrylicStand({ w: 11.5, h: 15.5, design: D("review", { nfc: true, accent: "#f59e0b", dark: true, aspect: 0.73 }) }), 0, 0, 0, rad(20)); cam = { pos: [-18, 15, 44], target: [0, 6.5, 0], fov: 24, zoom: 1.0 }; },
  "p-003": () => { wall(-0.1, 0xe5e3de); const s = disc({ r: 4, design: circleTex("sticker", { nfc: true, accent: "#ff6a13" }), thick: 0.06 }); s.rotation.x = Math.PI / 2; add(s, 0, 0, 0); s.position.z = 0.04; const s2 = disc({ r: 4, design: circleTex("sticker", { accent: "#ff6a13", cap: "Tu reseña" }), thick: 0.06 }); s2.rotation.x = Math.PI / 2; add(s2, 10, -2, 0.04); s2.rotation.x = Math.PI / 2; s2.rotation.z = 0; cam = { pos: [10, 6, 34], target: [4.5, -0.5, 0], fov: 24, zoom: 1.3 }; },
  "p-004": () => { floor(); add(acrylicStand({ w: 20, h: 14, tilt: -14, design: D("review", { aspect: 20 / 14 * 0.9, accent: "#d9480f" }) }), 0, 0, 0, rad(-14)); cam = { pos: [26, 14, 44], target: [0, 5.5, 0], fov: 26, zoom: 1.0 }; },
  /* Menús */
  "p-005": () => { table(); add(tent({ design: D("menu", { aspect: 10.5 / 15.8, dark: false, accent: "#c2410c" }) }), 0, 0, 0, rad(-20)); cam = { pos: [22, 17, 40], target: [0, 6.5, 0], fov: 25 }; },
  "p-006": () => { table(); add(acrylicStand({ w: 10, h: 14, design: D("menu", { nfc: true, aspect: 0.74, accent: "#ff6a13" }) }), 0, 0, 0, rad(16)); cam = { pos: [-16, 16, 40], target: [0, 6, 0], fov: 25 }; },
  "p-007": () => { table(); const a = disc({ r: 4.2, design: circleTex("sticker", { accent: "#c2410c", cap: "Escaneá la carta" }), thick: 0.06 }); add(a, -3, 0.03, 0, rad(10)); const b = disc({ r: 4.2, design: circleTex("sticker", { accent: "#c2410c", cap: "Escaneá la carta" }), thick: 0.06 }); add(b, 6, 0.03, 3, rad(-25)); cam = { pos: [4, 26, 22], target: [1.5, 0, 1], fov: 26 }; },
  "p-008": () => { table(); add(acrylicStand({ w: 18, h: 13, tilt: -16, design: D("review", { aspect: 18 / 13 * 0.9, accent: "#14213d", dark: true }) }), 0, 0, 0, rad(12)); cam = { pos: [-20, 14, 40], target: [0, 5, 0], fov: 26, zoom: 1.0 }; },
  "p-009": () => { table(); const phone = new THREE.Group(); const body = box(7.4, 15.2, 0.9, 0.9, new THREE.MeshPhysicalMaterial({ color: 0x1b1b1d, roughness: 0.3, metalness: 0.4, clearcoat: 0.6 })); const scr = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 14.4), new THREE.MeshBasicMaterial({ map: D("phone", { aspect: 6.8 / 14.4, radius: 40 }) })); scr.position.z = 0.46; phone.add(body, scr); phone.rotation.x = -Math.PI / 2; add(phone, -5, 0.45, 3, 0); phone.rotation.z = rad(16); add(tent({ w: 9, h: 13, depth: 4.5, design: D("menu", { aspect: 9 / 13.6, dark: true, accent: "#ff6a13" }) }), 7, 0, -3, rad(-22)); cam = { pos: [3, 30, 32], target: [0, 3, 0], fov: 28, zoom: 1.1 }; },
  /* Eventos */
  "p-010": () => { wall(-0.5, 0xeae9e5); const s1 = printDesign("strap", { aspect: 8, bg: "#0f2a4a", fg: "#fff" }); add(ribbon([[-6, 26, 0], [-4, 15, 0.3], [-0.5, 10.7, 0.3]].map((p) => new THREE.Vector3(...p)), 1.8, s1, new THREE.Vector3(0, 0, 1))); add(ribbon([[6, 26, 0], [4, 15, 0.3], [0.5, 10.7, 0.3]].map((p) => new THREE.Vector3(...p)), 1.8, s1.clone(), new THREE.Vector3(0, 0, 1))); add(clip(), 0, 10.1, 0.35); const tag = card({ w: 6.6, h: 6.6, d: 0.16, front: D("square", { aspect: 1, radius: 40 }), back: D("square", { aspect: 1, radius: 40 }) }); add(tag, 0, 3.6, 0.2); cam = { pos: [0, 8, 48], target: [0, 8, 0], fov: 24, zoom: 1.1 }; },
"p-011": () => { wall(-0.5, 0xe9e8e4); const pts = [[-7, 26, 0], [-4.5, 15, 0.3], [-0.5, 10.7, 0.3]].map((p) => new THREE.Vector3(...p)); const pts2 = [[7, 26, 0], [4.5, 15, 0.3], [0.5, 10.7, 0.3]].map((p) => new THREE.Vector3(...p)); const s = printDesign("strap", { aspect: 8, bg: "#ff6a13", fg: "#fff" }); add(ribbon(pts, 2, s, new THREE.Vector3(0, 0, 1))); add(ribbon(pts2, 2, s.clone(), new THREE.Vector3(0, 0, 1))); const cl = clip(); add(cl, 0, 10.1, 0.35); const b = card({ w: 9, h: 13.5, d: 0.18, front: D("badge", { aspect: 9 / 13.5, accent: "#ff6a13", radius: 30 }), back: D("badge", { aspect: 9 / 13.5, accent: "#ff6a13", radius: 30 }) }); add(b, 0, 1.6, 0.2); cam = { pos: [0, 6.5, 48], target: [0, 6.5, 0], fov: 24, zoom: 1.28 }; },
  "p-012": () => { floor(0xf0f0ed); const sh = new THREE.Shape(); const w = 5.6, h = 8, r = 0.9; sh.moveTo(-w / 2 + r, -h / 2); sh.lineTo(w / 2 - r, -h / 2); sh.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); sh.lineTo(w / 2, h / 2 - r); sh.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); sh.lineTo(-w / 2 + r, h / 2); sh.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); sh.lineTo(-w / 2, -h / 2 + r); sh.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2); const hole = new THREE.Path(); hole.absarc(0, h / 2 - 1.3, 0.45, 0, Math.PI * 2, true); sh.holes.push(hole); const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.22, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 3, curveSegments: 24 }); const body = new THREE.Mesh(geo, M.pvc(0x161616)); const g = new THREE.Group(); body.position.z = -0.11; const pl = plane(w * 0.88, h * 0.88 * 0.8, D("tag", { aspect: 0.66, radius: 30 }), 0.4); pl.position.set(0, -0.45, 0.2); const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.12, 20, 60), M.metal()); ring.position.set(0, h / 2 - 1.3 + 1.05, 0.0); ring.rotation.y = rad(70); g.add(body, pl, ring); g.rotation.x = -Math.PI / 2 + rad(8); g.rotation.z = rad(-24); add(g, 0, 0.4, 0); cam = { pos: [5, 26, 20], target: [0, 0, 0], fov: 26 }; },
  "p-013": () => { floor(0xf1f0ec); [[-3.4, -1.6, 7], [0.6, 0, -4], [4.4, 1.8, 3]].forEach(([x, z, a], i) => { const c = card({ w: 10.5, h: 15, d: 0.12, body: 0xfaf8f4, front: D("invite", { aspect: 10.5 / 15, radius: 20, accent: ["#7c2d12", "#14532d", "#1e3a8a"][i], bg: ["#faf8f4", "#f5f7f2", "#f3f5fa"][i] }) }); c.rotation.x = -Math.PI / 2; c.rotation.z = rad(a); add(c, x, 0.07 + i * 0.13, z); }); cam = { pos: [4, 24, 26], target: [0.5, 0, 0], fov: 27, zoom: 1.0 }; },
  /* Tarjetas */
  "p-014": () => { floor(); const front = card({ body: 0x171717, front: D("cardLogo", { aspect: 8.56 / 5.4, radius: 40 }), d: 0.1 }); front.rotation.x = -Math.PI / 2; front.rotation.z = rad(-14); add(front, -3, 0.05, 1.6); const back = card({ body: 0xffffff, front: D("cardContactBack", { aspect: 8.56 / 5.4, radius: 40, accent: "#ff6a13" }) }); back.rotation.x = -Math.PI / 2; back.rotation.z = rad(9); add(back, 2.8, 0.2, -1.4); cam = { pos: [5, 15, 24], target: [0, 0, 0], fov: 24, zoom: 1.0 }; },
  "p-015": () => { floor(0xefefec); const a = card({ body: 0x141414, front: D("cardLogo", { aspect: 8.56 / 5.4, radius: 40, nfcIcon: true, bg: "#141414", fg: "#f2f2f2" }) }); a.rotation.x = -Math.PI / 2; a.rotation.z = rad(12); add(a, -1.8, 0.05, 2); const b = card({ body: 0xf4f4f2, front: D("cardLogo", { aspect: 8.56 / 5.4, radius: 40, nfcIcon: true, bg: "#f4f4f2", fg: "#171717" }) }); b.rotation.x = -Math.PI / 2; b.rotation.z = rad(-8); add(b, 2.6, 0.2, -2.4); cam = { pos: [-4, 15, 24], target: [0, 0, 0], fov: 24, zoom: 1.0 }; },
  "p-016": () => { floor(); const a = card({ body: 0xffffff, front: D("cardQrNfc", { aspect: 8.56 / 5.4, radius: 40, accent: "#ff6a13" }) }); a.rotation.x = -Math.PI / 2; a.rotation.z = rad(-10); add(a, -2.4, 0.05, 2.2); const b = card({ body: 0xff6a13, front: D("cardLogo", { aspect: 8.56 / 5.4, radius: 40, bg: "#ff6a13", fg: "#fff" }) }); b.rotation.x = -Math.PI / 2; b.rotation.z = rad(8); add(b, 2.8, 0.2, -2.2); cam = { pos: [6, 15, 24], target: [0, 0, 0], fov: 24, zoom: 1.0 }; },
  /* Stickers */
  "p-017": () => { wall(-0.1, 0xe5e3de); const s = disc({ r: 4.2, design: circleTex("sticker", { accent: "#111", cap: "Escaneá" }), thick: 0.06 }); s.rotation.x = Math.PI / 2; add(s, 0, 0, 0.04); const t = disc({ r: 3.2, design: circleTex("sticker", { accent: "#ff6a13", cap: "Escaneá" }), thick: 0.06 }); t.rotation.x = Math.PI / 2; add(t, 9.5, -2.5, 0.04); cam = { pos: [9, 7, 32], target: [4.5, -0.8, 0], fov: 24 }; },
  "p-018": () => { floor(); const a = disc({ r: 4, design: circleTex("sticker", { nfc: true, accent: "#0f2a4a" }), thick: 0.08 }); add(a, -4.8, 0.04, 0.5); const b = disc({ r: 4, design: circleTex("antenna", {}), thick: 0.08 }); add(b, 4.6, 0.04, -1.2); cam = { pos: [2, 24, 17], target: [0, 0, 0], fov: 24 }; },
  "p-019": () => { floor(0xf0f0ed); const sheet = box(22, 0.1, 14, 0.2, M.matte(0xe3e5e8)); add(sheet, 0, 0.05, 0, rad(-4)); [[-5.2, -2.2], [5.2, -2.2]].forEach(([x, z], i) => { const l = card({ w: 9, h: 5.4, d: 0.05, front: D("stickerRect", { aspect: 9 / 5.4, radius: 30, t1: "Escaneá", t2: "para más info" }) }); l.rotation.x = -Math.PI / 2; add(l, x, 0.14, z, 0); }); const l3 = card({ w: 9, h: 5.4, d: 0.05, front: D("stickerRect", { aspect: 9 / 5.4, radius: 30, t1: "Escaneá", t2: "para más info" }) }); l3.rotation.x = -Math.PI / 2; l3.rotation.z = rad(6); add(l3, -3.5, 0.14, 4.2); cam = { pos: [4, 26, 18], target: [0, 0, 0.5], fov: 26, zoom: 1.3 }; },
  "p-020": () => { floor(0xefefec); const gp = glassPane({}); add(gp, 0, 0, 0, rad(-18)); const dec = card({ w: 11, h: 15, d: 0.04, front: D("stickerRect", { aspect: 11 / 15, radius: 36, nfc: true, t1: "Escaneá", t2: "y seguinos" }) }); dec.position.set(0, 20, 0.55); gp.add(dec); dec.castShadow = false; cam = { pos: [16, 18, 56], target: [0, 17, 0], fov: 26, zoom: 1.5 }; },
  /* Carta digital: reusa el teléfono + tent */
  /* Hero + categorías */
  hero: () => { floor(0xf1f1ee); add(acrylicStand({ w: 10, h: 14, design: D("review", { nfc: true, aspect: 0.72 }) }), -6, 0, 0, rad(14)); add(tent({ w: 9, h: 13, depth: 4.5, design: D("menu", { aspect: 9 / 13.6, dark: true, nfc: false }) }), 8, 0, -3, rad(-16)); const s = disc({ r: 3.4, design: circleTex("sticker", { accent: "#ff6a13", cap: "Escaneá" }), thick: 0.06 }); add(s, 2.2, 0.03, 8, rad(20)); const c = card({ body: 0x141414, front: D("cardLogo", { aspect: 8.56 / 5.4, radius: 40, nfcIcon: true, bg: "#141414" }) }); c.rotation.x = -Math.PI / 2; c.rotation.z = rad(-20); add(c, -6.5, 0.05, 8.5); cam = { pos: [1, 18, 46], target: [1, 4, 1.5], fov: 25, zoom: 1.12 }; },
  "cat-resenas": () => { floor(); add(acrylicStand({ w: 10, h: 14, design: D("review", { nfc: true, aspect: 0.72 }) }), -2, 0, 0, rad(-14)); const s = disc({ r: 3, design: circleTex("sticker", { nfc: true, accent: "#ff6a13" }), thick: 0.06 }); add(s, 8, 0.03, 4, rad(10)); cam = { pos: [10, 15, 36], target: [2, 5.5, 0], fov: 25 }; },
  "cat-menus": () => { table(); add(tent({ w: 9, h: 13, depth: 4.5, design: D("menu", { aspect: 9 / 13.6, dark: true, nfc: true }) }), -4, 0, 0, rad(18)); add(acrylicStand({ w: 8, h: 11.5, design: D("menu", { aspect: 8 / 11.5, dark: false, accent: "#c2410c" }) }), 7, 0, -3, rad(-14)); cam = { pos: [-2, 17, 38], target: [1, 5, -1], fov: 25 }; },
  "cat-eventos": () => { wall(-0.5, 0xe8e7e3); const s = printDesign("strap", { aspect: 8, bg: "#0f2a4a", fg: "#fff" }); add(ribbon([[-6, 24, 0], [-4, 14, 0.3], [-0.5, 9.7, 0.3]].map((p) => new THREE.Vector3(...p)), 1.8, s, new THREE.Vector3(0, 0, 1))); add(ribbon([[6, 24, 0], [4, 14, 0.3], [0.5, 9.7, 0.3]].map((p) => new THREE.Vector3(...p)), 1.8, s.clone(), new THREE.Vector3(0, 0, 1))); add(clip(), 0, 9.1, 0.35); const b = card({ w: 9, h: 13.5, d: 0.18, front: D("badge", { aspect: 9 / 13.5, accent: "#0f2a4a", radius: 30 }) }); add(b, 0, 1.0, 0.2); cam = { pos: [0, 6.5, 44], target: [0, 6.5, 0], fov: 24, zoom: 1.3 }; },
  "cat-tarjetas": () => { floor(0xefefec); const a = card({ body: 0x141414, front: D("cardLogo", { aspect: 8.56 / 5.4, radius: 40, nfcIcon: true, bg: "#141414" }) }); a.rotation.x = -Math.PI / 2; a.rotation.z = rad(-12); add(a, -1.2, 0.05, 1.6); const b = card({ body: 0xffffff, front: D("cardContactBack", { aspect: 8.56 / 5.4, radius: 40 }) }); b.rotation.x = -Math.PI / 2; b.rotation.z = rad(10); add(b, 1.8, 0.2, -1.8); cam = { pos: [2, 22, 17], target: [0, 0, 0], fov: 24 }; },
  "cat-stickers": () => { floor(); [[-6, 2, 3.6, false, 10], [1, -2, 4.2, true, -20], [7.6, 3.4, 3.2, false, 5]].forEach(([x, z, r, nfc, ry], i) => { const d = disc({ r, design: circleTex("sticker", { nfc, accent: i === 1 ? "#0f2a4a" : "#ff6a13", cap: "Escaneá" }), thick: 0.06 }); add(d, x, 0.03, z, rad(ry)); }); cam = { pos: [3, 24, 18], target: [1, 0, 0.5], fov: 24 }; },
};
SCENES["p-009"] ??= SCENES["p-009"];

/* ---------- render ---------- */
(SCENES[ID] || (() => { throw new Error("escena desconocida " + ID); }))();
const camera = new THREE.PerspectiveCamera(cam.fov, W / H, 1, 600);
const zoom = cam.zoom || 1.14;
const tg_ = new THREE.Vector3(...cam.target);
camera.position.copy(new THREE.Vector3(...cam.pos).sub(tg_).multiplyScalar(zoom).add(tg_));
camera.lookAt(...cam.target);

const acc = document.createElement("canvas");
acc.width = W * 2; acc.height = H * 2;
const ag = acc.getContext("2d");
document.body.appendChild(acc);
acc.style.width = W + "px"; acc.style.height = H + "px";
renderer.domElement.style.display = "none";
document.body.appendChild(renderer.domElement);

const base = new THREE.Vector3(-18, 26, 8);
let i = 0;
function step() {
  if (i >= FRAMES) { window.__done = true; return; }
  const a = (i / FRAMES) * Math.PI * 2 * 2.618, rr_ = Math.sqrt((i + 0.5) / FRAMES) * 6.5;
  key.position.set(base.x + Math.cos(a) * rr_, base.y, base.z + Math.sin(a) * rr_);
  key.target.position.set(0, 0, 0);
  const jx = (Math.random() - 0.5), jy = (Math.random() - 0.5);
  camera.setViewOffset(W * 2, H * 2, jx, jy, W * 2, H * 2);
  renderer.render(scene, camera);
  ag.globalAlpha = 1 / (i + 1);
  ag.drawImage(renderer.domElement, 0, 0, W * 2, H * 2);
  i++;
  requestAnimationFrame(step);
}
step();
