import { useState, useEffect, useRef, useCallback } from "react";

const PINTEREST_RED = "#E60023";
const SLOT_TIMES = [
  { label: "10:00 AM", hour: 10, minute: 0 },
  { label: "1:00 PM", hour: 13, minute: 0 },
  { label: "4:00 PM", hour: 16, minute: 0 },
  { label: "8:00 PM", hour: 20, minute: 0 },
  { label: "10:00 PM", hour: 22, minute: 0 },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, #root {
    background: #0d0f1a;
    color: #e2e6f0;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .app {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 16px 60px;
    min-height: 100vh;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 0 20px;
    border-bottom: 1px solid #1e2235;
    margin-bottom: 24px;
  }

  .header-logo {
    width: 36px;
    height: 36px;
    background: ${PINTEREST_RED};
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    color: white;
    font-family: 'Playfair Display', serif;
    flex-shrink: 0;
  }

  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #f0f2f8;
    letter-spacing: -0.3px;
  }

  .header-title span { color: ${PINTEREST_RED}; }

  .header-badge {
    margin-left: auto;
    font-size: 12px;
    background: #1a1d2e;
    border: 1px solid #2a2d3e;
    color: #7b83a8;
    padding: 4px 12px;
    border-radius: 20px;
  }

  .tabs {
    display: flex;
    gap: 4px;
    background: #131629;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 28px;
    border: 1px solid #1e2235;
  }

  .tab-btn {
    flex: 1;
    padding: 9px 16px;
    border: none;
    border-radius: 9px;
    background: transparent;
    color: #7b83a8;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    white-space: nowrap;
  }

  .tab-btn:hover { color: #c0c8e8; }

  .tab-btn.active {
    background: ${PINTEREST_RED};
    color: white;
    box-shadow: 0 2px 12px rgba(230,0,35,0.35);
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: #f0f2f8;
    margin-bottom: 20px;
  }

  .card {
    background: #131629;
    border: 1px solid #1e2235;
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 16px;
  }

  .card:hover { border-color: #2a2d42; }

  .label {
    font-size: 12px;
    font-weight: 500;
    color: #7b83a8;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    margin-bottom: 6px;
    display: block;
  }

  .input {
    width: 100%;
    background: #0d0f1a;
    border: 1px solid #1e2235;
    border-radius: 8px;
    padding: 10px 14px;
    color: #e2e6f0;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s;
  }

  .input:focus { border-color: ${PINTEREST_RED}; }

  .input-wrap {
    position: relative;
  }

  .input-wrap .input { padding-right: 40px; }

  .eye-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #7b83a8;
    cursor: pointer;
    font-size: 16px;
    padding: 2px;
  }

  .eye-btn:hover { color: #c0c8e8; }

  .btn {
    padding: 10px 18px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .btn-primary {
    background: ${PINTEREST_RED};
    color: white;
  }

  .btn-primary:hover { background: #c0001d; box-shadow: 0 2px 12px rgba(230,0,35,0.35); }

  .btn-secondary {
    background: #1a1d2e;
    color: #c0c8e8;
    border: 1px solid #2a2d3e;
  }

  .btn-secondary:hover { background: #1e2235; }

  .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 6px; }

  .btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .row { display: flex; gap: 12px; flex-wrap: wrap; }
  .row .col { flex: 1; min-width: 200px; }

  .form-group { margin-bottom: 16px; }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
  }

  .badge-green { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
  .badge-yellow { background: rgba(234,179,8,0.15); color: #facc15; border: 1px solid rgba(234,179,8,0.25); }
  .badge-red { background: rgba(230,0,35,0.15); color: #ff4d6d; border: 1px solid rgba(230,0,35,0.25); }
  .badge-blue { background: rgba(99,102,241,0.15); color: #818cf8; border: 1px solid rgba(99,102,241,0.25); }
  .badge-gray { background: rgba(123,131,168,0.15); color: #7b83a8; border: 1px solid rgba(123,131,168,0.25); }
  .badge-saved { background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); padding: 5px 14px; font-size: 12px; border-radius: 8px; }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .product-card {
    background: #131629;
    border: 1px solid #1e2235;
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 0.15s;
  }

  .product-card:hover { border-color: #2e3248; }

  .product-img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    background: #0d0f1a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: #2a2d42;
  }

  .product-body { padding: 14px; }

  .product-actions { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }

  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 9999;
    pointer-events: none;
  }

  .toast {
    background: #1a1d2e;
    border: 1px solid #2a2d3e;
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    color: #e2e6f0;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 260px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.5);
    animation: slideIn 0.25s ease;
    pointer-events: all;
  }

  @keyframes slideIn {
    from { transform: translateX(40px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .toast.fade-out {
    animation: slideOut 0.25s ease forwards;
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(40px); opacity: 0; }
  }

  .toast-success { border-left: 3px solid #4ade80; }
  .toast-error { border-left: 3px solid #ff4d6d; }
  .toast-info { border-left: 3px solid #818cf8; }
  .toast-warn { border-left: 3px solid #facc15; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.2);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .slot-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: #0d0f1a;
    border: 1px solid #1e2235;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .slot-time {
    font-size: 13px;
    font-weight: 600;
    color: ${PINTEREST_RED};
    min-width: 80px;
    font-family: 'DM Sans', sans-serif;
  }

  .slot-thumb {
    width: 40px; height: 40px;
    border-radius: 8px;
    object-fit: cover;
    background: #1e2235;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #3a3d52;
    flex-shrink: 0;
  }

  .slot-info { flex: 1; overflow: hidden; }
  .slot-title { font-size: 13px; font-weight: 500; color: #c0c8e8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .slot-sub { font-size: 11px; color: #7b83a8; margin-top: 2px; }

  .countdown {
    background: linear-gradient(135deg, #1a0a0e 0%, #1a1430 100%);
    border: 1px solid #2e1820;
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 20px;
    text-align: center;
  }

  .countdown-time {
    font-size: 36px;
    font-weight: 600;
    color: ${PINTEREST_RED};
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 2px;
  }

  .countdown-label {
    font-size: 12px;
    color: #7b83a8;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .log-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 16px;
    background: #0d0f1a;
    border: 1px solid #1e2235;
    border-radius: 10px;
    margin-bottom: 8px;
  }

  .log-thumb {
    width: 44px; height: 44px;
    border-radius: 8px;
    object-fit: cover;
    background: #1e2235;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  .stat-card {
    background: #131629;
    border: 1px solid #1e2235;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
  }

  .stat-num { font-size: 28px; font-weight: 600; color: #f0f2f8; font-family: 'DM Sans', sans-serif; }
  .stat-label { font-size: 11px; color: #7b83a8; text-transform: uppercase; letter-spacing: 0.6px; margin-top: 4px; }

  .divider { height: 1px; background: #1e2235; margin: 20px 0; }

  .board-dropdown {
    background: #0d0f1a;
    border: 1px solid #1e2235;
    border-radius: 8px;
    padding: 4px;
    margin-top: 10px;
  }

  .board-item {
    padding: 9px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    color: #c0c8e8;
    transition: background 0.1s;
  }

  .board-item:hover { background: #1e2235; }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .empty-state {
    text-align: center;
    padding: 48px 24px;
    color: #7b83a8;
    font-size: 14px;
  }

  .empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.4; }

  textarea.input { resize: vertical; min-height: 72px; }

  .img-source-tabs {
    display: flex;
    gap: 4px;
    background: #0d0f1a;
    border-radius: 7px;
    padding: 3px;
    margin-bottom: 8px;
    border: 1px solid #1e2235;
  }

  .img-source-tab {
    flex: 1;
    padding: 5px 8px;
    border: none;
    border-radius: 5px;
    background: transparent;
    color: #7b83a8;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
  }

  .img-source-tab.active {
    background: #1e2235;
    color: #c0c8e8;
  }

  .upload-zone {
    width: 100%;
    border: 1.5px dashed #2a2d42;
    border-radius: 8px;
    padding: 18px 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s;
    background: #0d0f1a;
    color: #7b83a8;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .upload-zone:hover {
    border-color: ${PINTEREST_RED};
    color: #c0c8e8;
  }

  .upload-zone.drag-over {
    border-color: ${PINTEREST_RED};
    background: rgba(230,0,35,0.05);
    color: #c0c8e8;
  }

  .upload-icon { font-size: 22px; }

  .upload-preview {
    position: relative;
    width: 100%;
  }

  .upload-preview img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #2a2d42;
    display: block;
  }

  .upload-clear {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(13,15,26,0.85);
    border: 1px solid #2a2d42;
    color: #c0c8e8;
    font-size: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }

  .upload-clear:hover { background: rgba(230,0,35,0.8); }
`;

function useStorage() {
  const get = useCallback(async (key) => {
    try {
      const r = await window.storage.get(key);
      return r ? JSON.parse(r.value) : null;
    } catch { return null; }
  }, []);

  const set = useCallback(async (key, value) => {
    try {
      await window.storage.set(key, JSON.stringify(value));
    } catch (e) { console.error(e); }
  }, []);

  return { get, set };
}

function genId() { return Math.random().toString(36).slice(2, 10); }

function nowIST() {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return ist;
}

function todayKey() {
  const d = nowIST();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function tomorrowKey() {
  const d = nowIST();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function slotDateTime(dateKey, slotIdx) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const s = SLOT_TIMES[slotIdx];
  const dt = new Date(y, m - 1, d, s.hour, s.minute, 0, 0);
  return dt;
}

function Toast({ toasts, remove }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type} ${t.fading ? "fade-out" : ""}`}>
          <span>{t.type === "success" ? "✓" : t.type === "error" ? "✗" : t.type === "warn" ? "⚠" : "ℹ"}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

function EyeBtn({ show, toggle }) {
  return <button className="eye-btn" onClick={toggle} type="button">{show ? "🙈" : "👁️"}</button>;
}

function ImageInput({ imageUrl, onUrlChange, onBase64Change }) {
  const [mode, setMode] = useState(imageUrl?.startsWith("data:") ? "upload" : "url");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onBase64Change(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const isBase64 = imageUrl?.startsWith("data:");

  return (
    <div>
      <div className="img-source-tabs">
        <button className={`img-source-tab ${mode === "url" ? "active" : ""}`} onClick={() => setMode("url")} type="button">🔗 URL</button>
        <button className={`img-source-tab ${mode === "upload" ? "active" : ""}`} onClick={() => setMode("upload")} type="button">📁 Upload</button>
      </div>
      {mode === "url" && (
        <input className="input" type="text" placeholder="https://example.com/image.jpg"
          value={isBase64 ? "" : (imageUrl || "")}
          onChange={e => onUrlChange(e.target.value)} />
      )}
      {mode === "upload" && (
        <>
          {isBase64 ? (
            <div className="upload-preview">
              <img src={imageUrl} alt="preview" />
              <button className="upload-clear" onClick={() => onBase64Change("")} title="Remove">✕</button>
            </div>
          ) : (
            <div
              className={`upload-zone ${dragging ? "drag-over" : ""}`}
              onClick={() => fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <span className="upload-icon">🖼️</span>
              <span>Click to upload or drag & drop</span>
              <span style={{ fontSize: 11, color: "#5a5f7a" }}>JPG, PNG, WEBP — any size</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
        </>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("settings");
  const [settings, setSettings] = useState({ token: "", groqKey: "", boardId: "" });
  const [savedOk, setSavedOk] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showGroq, setShowGroq] = useState(false);
  const [boards, setBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [products, setProducts] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [logs, setLogs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [countdown, setCountdown] = useState("");
  const [loadingAI, setLoadingAI] = useState({});
  const [loadingPost, setLoadingPost] = useState(false);
  const storage = useStorage();
  const toastRef = useRef(0);
  const fileRef = useRef();
  const restoreRef = useRef();

  const toast = useCallback((msg, type = "info") => {
    const id = ++toastRef.current;
    setToasts(p => [...p, { id, msg, type, fading: false }]);
    setTimeout(() => {
      setToasts(p => p.map(t => t.id === id ? { ...t, fading: true } : t));
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 300);
    }, 3000);
  }, []);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      const s = await storage.get("pint_settings");
      if (s) { setSettings(s); setSavedOk(true); }
      const p = await storage.get("pint_products");
      if (p) setProducts(p);
      const sc = await storage.get("pint_schedule");
      if (sc) setSchedule(sc);
      const lg = await storage.get("pint_logs");
      if (lg) setLogs(lg);
    })();
  }, []);

  // Save helpers
  const saveProducts = useCallback(async (p) => {
    setProducts(p);
    await storage.set("pint_products", p);
  }, []);

  const saveSchedule = useCallback(async (sc) => {
    setSchedule(sc);
    await storage.set("pint_schedule", sc);
  }, []);

  const saveLogs = useCallback(async (lg) => {
    setLogs(lg);
    await storage.set("pint_logs", lg);
  }, []);

  // Countdown timer
  useEffect(() => {
    const update = () => {
      const todaySchedule = schedule[todayKey()] || [];
      const now = Date.now();
      const upcoming = todaySchedule
        .filter(s => s.status === "scheduled" && slotDateTime(todayKey(), s.slotIdx).getTime() > now)
        .sort((a, b) => SLOT_TIMES[a.slotIdx].hour - SLOT_TIMES[b.slotIdx].hour);
      if (!upcoming.length) {
        setCountdown("--:--:--");
        return;
      }
      const next = slotDateTime(todayKey(), upcoming[0].slotIdx);
      const diff = Math.max(0, next.getTime() - now);
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [schedule]);

  // Auto-post checker
  const postToPin = useCallback(async (product, slotKey, slotIdx) => {
    const { token, boardId } = settings;
    if (!token || !boardId) return false;
    try {
      const resp = await fetch("https://api.pinterest.com/v5/pins", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          board_id: boardId,
          title: product.title,
          description: product.description,
          link: product.affiliateLink,
          media_source: { source_type: "image_url", url: product.imageUrl },
        }),
      });
      return resp.ok;
    } catch { return false; }
  }, [settings]);

  useEffect(() => {
    const check = async () => {
      const now = nowIST();
      const tk = todayKey();
      const todaySchedule = (schedule[tk] || []);
      let changed = false;
      const newSchedule = { ...schedule, [tk]: [...(schedule[tk] || [])] };
      const newProducts = [...products];
      const newLogs = [...logs];

      for (let i = 0; i < newSchedule[tk].length; i++) {
        const slot = newSchedule[tk][i];
        if (slot.status !== "scheduled") continue;
        const slotTime = slotDateTime(tk, slot.slotIdx);
        if (slotTime <= now) {
          const prod = newProducts.find(p => p.id === slot.productId);
          if (!prod) continue;
          const ok = await postToPin(prod, tk, slot.slotIdx);
          newSchedule[tk][i] = { ...slot, status: ok ? "posted" : "failed" };
          const pi = newProducts.findIndex(p => p.id === slot.productId);
          if (pi >= 0) newProducts[pi] = { ...newProducts[pi], status: ok ? "posted" : "failed" };
          newLogs.unshift({
            id: genId(),
            productId: slot.productId,
            title: prod.title,
            imageUrl: prod.imageUrl,
            time: now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            status: ok ? "posted" : "failed",
          });
          changed = true;
          toast(ok ? `✅ Posted: ${prod.title}` : `❌ Failed: ${prod.title}`, ok ? "success" : "error");
        }
      }

      if (changed) {
        await saveSchedule(newSchedule);
        await saveProducts(newProducts);
        await saveLogs(newLogs);
      }

      // Auto-schedule tomorrow if today's all done or it's a new day with no schedule
      const tmk = tomorrowKey();
      if (!schedule[tmk]) {
        const pending = newProducts.filter(p => p.status === "pending").slice(0, 5);
        if (pending.length) {
          const tmSlots = pending.map((p, i) => ({ productId: p.id, slotIdx: i, status: "scheduled" }));
          const fullSched = { ...newSchedule, [tmk]: tmSlots };
          await saveSchedule(fullSched);
          const updP = newProducts.map(p => {
            const assigned = pending.find(x => x.id === p.id);
            return assigned ? { ...p, status: "scheduled" } : p;
          });
          await saveProducts(updP);
        }
      }
    };

    check();
    const iv = setInterval(check, 60000);
    return () => clearInterval(iv);
  }, [schedule, products, settings]);

  // Settings
  const saveSettings = async () => {
    await storage.set("pint_settings", JSON.stringify(settings));
    setSavedOk(true);
    toast("Settings saved successfully", "success");
  };

  const fetchBoards = async () => {
    if (!settings.token) { toast("Enter Pinterest token first", "warn"); return; }
    setLoadingBoards(true);
    try {
      const r = await fetch("https://api.pinterest.com/v5/boards", {
        headers: { Authorization: `Bearer ${settings.token}` },
      });
      const data = await r.json();
      if (data.items) {
        setBoards(data.items);
        toast(`Fetched ${data.items.length} boards`, "success");
      } else {
        toast("No boards found or invalid token", "error");
      }
    } catch { toast("Failed to fetch boards", "error"); }
    setLoadingBoards(false);
  };

  // Queue
  const addProduct = async () => {
    const p = {
      id: genId(), imageUrl: "", title: "", description: "", affiliateLink: "", status: "pending",
    };
    await saveProducts([...products, p]);
  };

  const updateProduct = async (id, field, val) => {
    const updated = products.map(p => p.id === id ? { ...p, [field]: val } : p);
    await saveProducts(updated);
  };

  const deleteProduct = async (id) => {
    await saveProducts(products.filter(p => p.id !== id));
    toast("Product removed", "info");
  };

  const generateAI = async (id) => {
    if (!settings.groqKey) { toast("Enter Groq API key first", "warn"); return; }
    const prod = products.find(p => p.id === id);
    setLoadingAI(l => ({ ...l, [id]: true }));
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${settings.groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          max_tokens: 300,
          messages: [{
            role: "user",
            content: `Generate a Pinterest title and description for this product image URL: ${prod.imageUrl || "a fashion product"}. Target Indian women aged 18-35, fashion and beauty niche, SEO-optimized with trending keywords, include relevant Indian fashion hashtags. Return ONLY valid JSON: {"title": "...", "description": "..."}`,
          }],
        }),
      });
      const data = await r.json();
      const text = data.choices?.[0]?.message?.content || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const updated = products.map(p => p.id === id ? { ...p, title: parsed.title, description: parsed.description } : p);
      await saveProducts(updated);
      toast("AI content generated!", "success");
    } catch { toast("AI generation failed", "error"); }
    setLoadingAI(l => ({ ...l, [id]: false }));
  };

  // Schedule
  const scheduleToday = async () => {
    const tk = todayKey();
    const now = nowIST();
    const existingIds = (schedule[tk] || []).map(s => s.productId);
    const pending = products.filter(p => p.status === "pending" && !existingIds.includes(p.id));
    if (!pending.length) { toast("No pending products to schedule", "warn"); return; }

    const availableSlots = SLOT_TIMES.map((s, i) => {
      const dt = slotDateTime(tk, i);
      return { idx: i, dt, passed: dt <= now };
    }).filter(s => !s.passed);

    if (!availableSlots.length) { toast("All time slots passed today. Schedule tomorrow instead.", "warn"); return; }

    const toAssign = pending.slice(0, availableSlots.length);
    const newSlots = toAssign.map((p, i) => ({ productId: p.id, slotIdx: availableSlots[i].idx, status: "scheduled" }));

    const existing = schedule[tk] || [];
    const newSchedule = { ...schedule, [tk]: [...existing, ...newSlots] };
    await saveSchedule(newSchedule);

    const updatedProducts = products.map(p => {
      const assigned = toAssign.find(x => x.id === p.id);
      return assigned ? { ...p, status: "scheduled" } : p;
    });
    await saveProducts(updatedProducts);
    toast(`Scheduled ${toAssign.length} posts for today`, "success");
  };

  const postNow = async () => {
    const tk = todayKey();
    const todaySlots = schedule[tk] || [];
    const next = todaySlots.find(s => s.status === "scheduled");
    if (!next) { toast("No scheduled posts", "warn"); return; }
    const prod = products.find(p => p.id === next.productId);
    if (!prod) return;
    setLoadingPost(true);
    const ok = await postToPin(prod, tk, next.slotIdx);
    const newSlots = (schedule[tk] || []).map(s => s.productId === next.productId ? { ...s, status: ok ? "posted" : "failed" } : s);
    await saveSchedule({ ...schedule, [tk]: newSlots });
    const updP = products.map(p => p.id === prod.id ? { ...p, status: ok ? "posted" : "failed" } : p);
    await saveProducts(updP);
    const newLog = {
      id: genId(), productId: prod.id, title: prod.title, imageUrl: prod.imageUrl,
      time: nowIST().toLocaleString("en-IN"), status: ok ? "posted" : "failed",
    };
    await saveLogs([newLog, ...logs]);
    toast(ok ? `Posted: ${prod.title}` : `Failed: ${prod.title}`, ok ? "success" : "error");
    setLoadingPost(false);
  };

  // Backup/Restore
  const backup = async () => {
    const data = { settings, products, schedule, logs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `pinterest-backup-${todayKey()}.json`; a.click();
    URL.revokeObjectURL(url);
    toast("Backup downloaded", "success");
  };

  const restore = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.settings) { setSettings(data.settings); await storage.set("pint_settings", JSON.stringify(data.settings)); }
        if (data.products) await saveProducts(data.products);
        if (data.schedule) await saveSchedule(data.schedule);
        if (data.logs) await saveLogs(data.logs);
        setSavedOk(true);
        toast("Backup restored!", "success");
      } catch { toast("Invalid backup file", "error"); }
    };
    reader.readAsText(file);
  };

  // Retry failed
  const retryFailed = async (logItem) => {
    const updP = products.map(p => p.id === logItem.productId ? { ...p, status: "pending" } : p);
    await saveProducts(updP);
    toast("Moved back to pending", "info");
  };

  const todaySlots = schedule[todayKey()] || [];
  const tomorrowSlots = schedule[tomorrowKey()] || [];

  const getProductById = (id) => products.find(p => p.id === id);
  const pendingCount = products.filter(p => p.status === "pending").length;
  const postedCount = logs.filter(l => l.status === "posted").length;
  const failedCount = logs.filter(l => l.status === "failed").length;
  const successRate = logs.length ? Math.round((postedCount / logs.length) * 100) : 0;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-logo">P</div>
          <div className="header-title">Pin<span>Auto</span></div>
          {savedOk && <div className="badge-saved" style={{ marginLeft: "auto", fontSize: 12, padding: "5px 14px", borderRadius: 8, background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>APIs Saved ✅</div>}
        </div>

        <div className="tabs">
          {[["settings","⚙ Settings"],["queue","📦 Queue"],["schedule","📅 Schedule"],["log","📋 Log"]].map(([k, label]) => (
            <button key={k} className={`tab-btn ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{label}</button>
          ))}
        </div>

        {/* ─── SETTINGS ─── */}
        {tab === "settings" && (
          <div>
            <div className="section-title">API Configuration</div>
            <div className="card">
              <div className="form-group">
                <label className="label">Pinterest Bearer Token</label>
                <div className="input-wrap">
                  <input className="input" type={showToken ? "text" : "password"} placeholder="Bearer token…" value={settings.token} onChange={e => setSettings(s => ({ ...s, token: e.target.value }))} />
                  <EyeBtn show={showToken} toggle={() => setShowToken(v => !v)} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Groq API Key</label>
                <div className="input-wrap">
                  <input className="input" type={showGroq ? "text" : "password"} placeholder="gsk_…" value={settings.groqKey} onChange={e => setSettings(s => ({ ...s, groqKey: e.target.value }))} />
                  <EyeBtn show={showGroq} toggle={() => setShowGroq(v => !v)} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Pinterest Board ID</label>
                <input className="input" type="text" placeholder="Board ID" value={settings.boardId} onChange={e => setSettings(s => ({ ...s, boardId: e.target.value }))} />
              </div>

              <div className="row" style={{ marginBottom: 12 }}>
                <button className="btn btn-secondary" onClick={fetchBoards} disabled={loadingBoards}>
                  {loadingBoards ? <><div className="spinner" /> Fetching…</> : "🗂 Fetch My Boards"}
                </button>
              </div>

              {boards.length > 0 && (
                <div className="board-dropdown">
                  {boards.map(b => (
                    <div key={b.id} className="board-item" onClick={() => { setSettings(s => ({ ...s, boardId: b.id })); toast(`Board selected: ${b.name}`, "success"); }}>
                      {b.name} <span style={{ color: "#7b83a8", fontSize: 11 }}>— {b.id}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="divider" />
              <div className="row">
                <button className="btn btn-primary" onClick={saveSettings}>💾 Save Settings</button>
                <button className="btn btn-secondary" onClick={backup}>⬇ Backup Data</button>
                <button className="btn btn-secondary" onClick={() => restoreRef.current.click()}>⬆ Restore Backup</button>
                <input ref={restoreRef} type="file" accept=".json" style={{ display: "none" }} onChange={restore} />
              </div>
            </div>
          </div>
        )}

        {/* ─── QUEUE ─── */}
        {tab === "queue" && (
          <div>
            <div className="section-header">
              <div className="section-title" style={{ marginBottom: 0 }}>{products.length} products in queue</div>
              <button className="btn btn-primary" onClick={addProduct}>+ Add Product</button>
            </div>
            {products.length === 0 && (
              <div className="empty-state"><div className="empty-icon">📦</div>No products yet. Add one to get started!</div>
            )}
            <div className="product-grid">
              {products.map(prod => (
                <div key={prod.id} className="product-card">
                  {prod.imageUrl ? (
                    <img src={prod.imageUrl} alt={prod.title} className="product-img" onError={e => { e.target.style.display = "none"; }} />
                  ) : (
                    <div className="product-img">🖼</div>
                  )}
                  <div className="product-body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span className={`badge badge-${prod.status === "posted" ? "green" : prod.status === "failed" ? "red" : prod.status === "scheduled" ? "blue" : "gray"}`}>
                        {prod.status === "posted" ? "✓ Posted" : prod.status === "failed" ? "✗ Failed" : prod.status === "scheduled" ? "⏰ Scheduled" : "Pending"}
                      </span>
                      <button className="btn btn-sm btn-secondary" style={{ color: "#ff4d6d", borderColor: "rgba(255,77,109,0.3)" }} onClick={() => deleteProduct(prod.id)}>✕</button>
                    </div>
                    <div className="form-group">
                      <label className="label">Image</label>
                      <ImageInput
                        imageUrl={prod.imageUrl}
                        onUrlChange={val => updateProduct(prod.id, "imageUrl", val)}
                        onBase64Change={val => updateProduct(prod.id, "imageUrl", val)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Title</label>
                      <input className="input" type="text" placeholder="Product title" value={prod.title} onChange={e => updateProduct(prod.id, "title", e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="label">Description</label>
                      <textarea className="input" placeholder="Description + hashtags" value={prod.description} onChange={e => updateProduct(prod.id, "description", e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="label">Affiliate Link</label>
                      <input className="input" type="text" placeholder="https://…" value={prod.affiliateLink} onChange={e => updateProduct(prod.id, "affiliateLink", e.target.value)} />
                    </div>
                    <div className="product-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => generateAI(prod.id)} disabled={loadingAI[prod.id]}>
                        {loadingAI[prod.id] ? <><div className="spinner" style={{ borderTopColor: "#818cf8", borderColor: "rgba(129,140,248,0.3)" }} /> Generating…</> : "✨ AI Generate"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── SCHEDULE ─── */}
        {tab === "schedule" && (
          <div>
            <div className="countdown">
              <div className="countdown-time">{countdown}</div>
              <div className="countdown-label">Until next scheduled post</div>
            </div>

            <div className="section-header">
              <div className="section-title" style={{ marginBottom: 0 }}>Today's Schedule · {todayKey()}</div>
              <div className="row" style={{ gap: 8 }}>
                <button className="btn btn-secondary" onClick={postNow} disabled={loadingPost}>
                  {loadingPost ? <><div className="spinner" /> Posting…</> : "⚡ Post Now"}
                </button>
                <button className="btn btn-primary" onClick={scheduleToday}>📅 Schedule Today</button>
              </div>
            </div>

            {SLOT_TIMES.map((slot, i) => {
              const assigned = todaySlots.find(s => s.slotIdx === i);
              const prod = assigned ? getProductById(assigned.productId) : null;
              const isPast = slotDateTime(todayKey(), i) <= nowIST();
              return (
                <div key={i} className="slot-row" style={{ opacity: isPast && !assigned ? 0.45 : 1 }}>
                  <div className="slot-time">{slot.label}</div>
                  {prod?.imageUrl ? (
                    <img src={prod.imageUrl} alt="" className="slot-thumb" />
                  ) : (
                    <div className="slot-thumb">{assigned ? "📌" : isPast ? "✗" : "○"}</div>
                  )}
                  <div className="slot-info">
                    <div className="slot-title">{prod?.title || (isPast ? "Slot passed" : "Empty slot")}</div>
                    <div className="slot-sub">{assigned ? `Status: ${assigned.status}` : "No post assigned"}</div>
                  </div>
                  {assigned && (
                    <span className={`badge badge-${assigned.status === "posted" ? "green" : assigned.status === "failed" ? "red" : "blue"}`}>
                      {assigned.status}
                    </span>
                  )}
                </div>
              );
            })}

            <div className="divider" />
            <div className="section-title">Tomorrow's Preview · {tomorrowKey()}</div>
            {tomorrowSlots.length === 0 ? (
              <div className="empty-state" style={{ padding: "24px" }}><div style={{ color: "#7b83a8", fontSize: 14 }}>Will auto-schedule {pendingCount > 0 ? Math.min(pendingCount, 5) : 0} pending products</div></div>
            ) : (
              tomorrowSlots.map((slot, i) => {
                const prod = getProductById(slot.productId);
                return (
                  <div key={i} className="slot-row">
                    <div className="slot-time">{SLOT_TIMES[slot.slotIdx].label}</div>
                    {prod?.imageUrl ? <img src={prod.imageUrl} alt="" className="slot-thumb" /> : <div className="slot-thumb">📌</div>}
                    <div className="slot-info">
                      <div className="slot-title">{prod?.title || "—"}</div>
                      <div className="slot-sub">Scheduled for tomorrow</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ─── LOG ─── */}
        {tab === "log" && (
          <div>
            <div className="stats-row">
              <div className="stat-card"><div className="stat-num">{logs.length}</div><div className="stat-label">Total Posts</div></div>
              <div className="stat-card"><div className="stat-num" style={{ color: "#4ade80" }}>{postedCount}</div><div className="stat-label">Successful</div></div>
              <div className="stat-card"><div className="stat-num" style={{ color: PINTEREST_RED }}>{successRate}%</div><div className="stat-label">Success Rate</div></div>
            </div>

            {logs.length === 0 && (
              <div className="empty-state"><div className="empty-icon">📋</div>No posts yet. Schedule something first!</div>
            )}

            {logs.map(log => (
              <div key={log.id} className="log-row">
                {log.imageUrl ? (
                  <img src={log.imageUrl} alt="" className="log-thumb" />
                ) : (
                  <div className="log-thumb" style={{ background: "#1e2235", borderRadius: 8, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📌</div>
                )}
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#c0c8e8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{log.title}</div>
                  <div style={{ fontSize: 11, color: "#7b83a8", marginTop: 2 }}>{log.time}</div>
                </div>
                <span className={`badge badge-${log.status === "posted" ? "green" : "red"}`}>{log.status === "posted" ? "✓ Posted" : "✗ Failed"}</span>
                {log.status === "failed" && (
                  <button className="btn btn-sm btn-secondary" onClick={() => retryFailed(log)}>↺ Retry</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast toasts={toasts} />
    </>
  );
}
