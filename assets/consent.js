/* ============================================================
   Cookie / privacy consent — Nissa Ole Kinyaga
   ------------------------------------------------------------
   The site itself sets NO cookies and runs NO tracking today.
   This banner records the visitor's choice (in localStorage,
   which is strictly-necessary storage) and exposes a gate so
   any analytics added LATER only loads after "Accept".

   To wire future analytics (e.g. GA4):
       NKConsent.onAccept(function () {
         // load your analytics script here
       });
   It fires immediately if consent was already granted.
   ============================================================ */
(function () {
  "use strict";
  var KEY = "nk-consent";          // "accepted" | "declined"
  var listeners = [];

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function fireAccept() {
    listeners.forEach(function (cb) { try { cb(); } catch (e) {} });
    listeners = [];
  }

  // Public API ------------------------------------------------
  window.NKConsent = {
    status: function () { return get(); },
    onAccept: function (cb) {
      if (typeof cb !== "function") return;
      if (get() === "accepted") cb();
      else listeners.push(cb);
    },
    reopen: function () { localStorage.removeItem(KEY); render(); }
  };

  // Styles ----------------------------------------------------
  function injectStyles() {
    if (document.getElementById("nk-consent-style")) return;
    var css =
      ".nk-consent{position:fixed;left:0;right:0;bottom:0;z-index:9999;" +
      "display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap;" +
      "padding:16px clamp(16px,4vw,40px);background:rgba(33,30,26,.97);color:#f6efe2;" +
      "font-family:'Mulish',system-ui,sans-serif;font-size:.92rem;line-height:1.5;" +
      "box-shadow:0 -10px 40px -12px rgba(0,0,0,.5);" +
      "transform:translateY(110%);transition:transform .5s cubic-bezier(.4,0,.1,1)}" +
      ".nk-consent.is-in{transform:translateY(0)}" +
      ".nk-consent__txt{max-width:62ch;margin:0}" +
      ".nk-consent__txt a{color:#9eb06a;text-decoration:underline;text-underline-offset:2px}" +
      ".nk-consent__btns{display:flex;gap:10px;flex-shrink:0}" +
      ".nk-consent__btn{font:inherit;font-weight:700;cursor:pointer;border-radius:100px;" +
      "padding:.6rem 1.3rem;border:1.5px solid transparent;transition:transform .25s,background .25s,color .25s}" +
      ".nk-consent__btn:focus-visible{outline:2px solid #9eb06a;outline-offset:3px}" +
      ".nk-consent__btn--accept{background:#8b9a5b;color:#1d2110}" +
      ".nk-consent__btn--accept:hover{background:#9eb06a;transform:translateY(-2px)}" +
      ".nk-consent__btn--decline{background:transparent;color:#f6efe2;border-color:rgba(246,239,226,.4)}" +
      ".nk-consent__btn--decline:hover{border-color:#f6efe2;transform:translateY(-2px)}" +
      "@media (prefers-reduced-motion:reduce){.nk-consent{transition:none}}" +
      "@media (max-width:640px){.nk-consent{flex-direction:column;align-items:flex-start;text-align:left}" +
      ".nk-consent__btns{width:100%}.nk-consent__btn{flex:1}}";
    var s = document.createElement("style");
    s.id = "nk-consent-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  // Banner ----------------------------------------------------
  function render() {
    if (get()) return;                 // choice already made
    if (document.querySelector(".nk-consent")) return;
    injectStyles();

    var bar = document.createElement("aside");
    bar.className = "nk-consent";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-live", "polite");
    bar.setAttribute("aria-label", "Privacy and cookies");
    bar.innerHTML =
      '<p class="nk-consent__txt">This site uses no tracking cookies. With your consent we may add ' +
      'simple, privacy-friendly analytics to understand visits. You can decline and everything still works. ' +
      '<a href="index.html#contact">Get in touch</a> with any questions.</p>' +
      '<div class="nk-consent__btns">' +
        '<button type="button" class="nk-consent__btn nk-consent__btn--decline" data-act="declined">Decline</button>' +
        '<button type="button" class="nk-consent__btn nk-consent__btn--accept" data-act="accepted">Accept</button>' +
      '</div>';

    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      var choice = b.getAttribute("data-act");
      set(choice);
      bar.classList.remove("is-in");
      window.setTimeout(function () { bar.remove(); }, 500);
      if (choice === "accepted") fireAccept();
    });

    document.body.appendChild(bar);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { bar.classList.add("is-in"); });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
