/* Lector de QR dentro de cada momento: usa la misma cámara que ya está abierta para saltar a otro momento. */
(function () {
  var PAGES = { "/momento2.html": "Momento 2", "/momento3.html": "Momento 3", "/momento6.html": "Momento 4" };
  var here = location.pathname.replace(/\/+$/, "");
  var st = document.createElement("style");
  st.textContent =
    "#qrchip{position:fixed;z-index:12;top:62px;left:50%;transform:translateX(-50%);max-width:86vw;box-sizing:border-box;text-align:center;display:none;" +
    "padding:7px 14px;border-radius:18px;background:rgba(28,10,51,.72);border:1px solid rgba(255,255,255,.35);color:#fff;font:600 12px 'Plus Jakarta Sans',system-ui,sans-serif;pointer-events:none}" +
    "#qrtoast{position:fixed;z-index:40;left:50%;top:50%;transform:translate(-50%,-50%) scale(.9);padding:16px 24px;border-radius:18px;background:#fff;color:#4c1d95;" +
    "font:700 17px 'Plus Jakarta Sans',system-ui,sans-serif;text-align:center;box-shadow:0 10px 30px rgba(28,10,51,.5);opacity:0;pointer-events:none;transition:opacity .25s,transform .25s}" +
    "#qrtoast.on{opacity:1;transform:translate(-50%,-50%) scale(1)}";
  document.head.appendChild(st);
  var chip = document.createElement("div"); chip.id = "qrchip"; chip.textContent = "¿Otro momento? Apunta al código QR de esa página"; document.body.appendChild(chip);
  var toast = document.createElement("div"); toast.id = "qrtoast"; document.body.appendChild(toast);
  var tt = null;
  function say(msg, ms) { toast.textContent = msg; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("on"); }, ms || 2200); }

  var det = null;
  try { if ("BarcodeDetector" in window) det = new BarcodeDetector({ formats: ["qr_code"] }); } catch (e) { det = null; }
  var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d", { willReadFrequently: true });
  var busy = false, going = false, lastBad = 0;

  function handle(text) {
    var u; try { u = new URL(text, location.href); } catch (e) { return; }
    var path = u.pathname.replace(/\/+$/, "");
    if (PAGES[path]) {
      if (path === here) return;                       // es el QR de esta misma página
      going = true;
      say("Abriendo " + PAGES[path] + "…", 4000);
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(function () { location.href = location.origin + path; }, 450);   // mismo sitio: el permiso de cámara se conserva
    } else if (Date.now() - lastBad > 4000) {
      lastBad = Date.now(); say("Ese código no es de la invitación", 1800);
    }
  }
  function tick() {
    if (going || busy) return;
    var v = null, vs = document.querySelectorAll("video");            // la cámara es el <video> con una transmisión en vivo
    for (var q = 0; q < vs.length; q++) { if (vs[q].srcObject && vs[q].srcObject.getVideoTracks) { v = vs[q]; break; } }
    if (!v || v.readyState < 2 || !v.videoWidth) return;
    chip.style.display = "block";
    busy = true;
    var w = Math.min(640, v.videoWidth), h = Math.round(v.videoHeight * w / v.videoWidth);
    canvas.width = w; canvas.height = h; ctx.drawImage(v, 0, 0, w, h);
    if (det) {
      det.detect(canvas).then(function (r) { busy = false; if (r && r[0] && r[0].rawValue) handle(r[0].rawValue); })
        .catch(function () { busy = false; det = null; });
    } else if (window.jsQR) {
      var id = ctx.getImageData(0, 0, w, h);
      var c = window.jsQR(id.data, w, h, { inversionAttempts: "dontInvert" });
      busy = false; if (c && c.data) handle(c.data);
    } else busy = false;
  }
  setInterval(tick, 420);
})();
