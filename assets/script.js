/* Nissa Ole Kinyaga — interactions */
(function () {
  'use strict';

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* year */
  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* nav shrink */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('shrink', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* mobile menu */
  const burger = $('.nav__burger');
  const links = $('.nav__links');
  const MENU_OPEN_CSS =
    'display:flex;position:fixed;inset:64px 1rem auto 1rem;flex-direction:column;gap:1.2rem;' +
    'background:rgba(236,226,210,.96);backdrop-filter:blur(18px);padding:1.6rem;border-radius:20px;' +
    'box-shadow:0 30px 60px -20px rgba(45,30,18,.4);z-index:999';
  const setMenu = (open) => {
    links.style.cssText = open ? MENU_OPEN_CSS : '';
    if (burger) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.classList.toggle('is-open', open);
    }
  };
  if (burger) {
    burger.setAttribute('aria-expanded', 'false');
    burger.addEventListener('click', () => setMenu(links.style.display !== 'flex'));
  }
  $$('.nav__links a').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth <= 720) setMenu(false);
  }));
  /* close the open mobile menu on Escape or when resizing back to desktop */
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 720) setMenu(false); }, { passive: true });

  /* scroll progress bar + current-section overlay */
  const progBar = $('#scrollProgBar');
  const pill = $('#sectionPill');
  const pillNum = $('#sectionPillNum');
  const pillName = $('#sectionPillName');
  const navLinks = $$('.nav__links a[href^="#"]');

  /* ordered list of sections to track, with friendly labels */
  const sectionList = [
    { id: 'story',   label: 'The Story' },
    { id: 'journey', label: 'The Journey' },
    { id: 'field',   label: 'In the Field' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'words',   label: 'In Their Words' },
    { id: 'creed',   label: 'Philosophy' },
    { id: 'contact', label: 'Plan a Safari' }
  ].map((s, i) => ({ ...s, num: i + 1, el: document.getElementById(s.id) }))
   .filter((s) => s.el);

  if (progBar) {
    const docH = () => (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const updateProg = () => {
      const p = Math.min(Math.max(window.scrollY / docH(), 0), 1);
      progBar.style.transform = 'scaleX(' + p + ')';
      if (pill) pill.classList.toggle('show', window.scrollY > window.innerHeight * 0.55);
    };
    updateProg();
    window.addEventListener('scroll', updateProg, { passive: true });
    window.addEventListener('resize', updateProg, { passive: true });
  }

  if (pill && sectionList.length) {
    const setActive = (s) => {
      pillNum.textContent = String(s.num).padStart(2, '0');
      pillName.textContent = s.label;
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + s.id));
    };
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const s = sectionList.find((x) => x.el === e.target);
        if (s) setActive(s);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sectionList.forEach((s) => spy.observe(s.el));
  }

  /* reveal on scroll */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const d = e.target.dataset.d ? Number(e.target.dataset.d) * 90 : 0;
        setTimeout(() => e.target.classList.add('in'), d);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  /* count up stats */
  const fmt = (n) => n.toLocaleString('en-US');
  const counted = new WeakSet();
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const el = e.target;
      if (!e.isIntersecting || counted.has(el)) return;
      counted.add(el);
      const target = Number(el.dataset.count);
      const dur = 1400; const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => cio.observe(el));

  /* hero parallax */
  const blobA = $('.hero__blob--a');
  const blobB = $('.hero__blob--b');
  const portrait = $('.hero__portrait');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        if (blobA) blobA.style.transform = `translateY(${y * 0.12}px)`;
        if (blobB) blobB.style.transform = `translateY(${y * -0.08}px)`;
        if (portrait) portrait.style.transform = `translateY(${y * 0.05}px)`;
      }
    }, { passive: true });
  }

  /* custom cursor */
  const cur = $('.cursor');
  if (cur && matchMedia('(hover:hover)').matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    const loop = () => {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$('a, button, .card, .frame').forEach((el) => {
      el.addEventListener('mouseenter', () => cur.classList.add('is-hot'));
      el.addEventListener('mouseleave', () => cur.classList.remove('is-hot'));
    });
  }

  /* gallery lightbox with arrow navigation */
  const lb = $('#lightbox');
  if (lb) {
    const lbImg = $('.lightbox__img', lb);
    const lbCap = $('.lightbox__cap', lb);
    const lbCount = $('.lightbox__count', lb);
    const shots = $$('.shot');

    const slides = shots.map((fig) => {
      const cap = $('figcaption', fig);
      const title = cap && $('span', cap) ? $('span', cap).textContent.trim() : '';
      const sub = cap ? cap.lastChild.textContent.trim() : '';
      return { src: fig.dataset.full, alt: $('img', fig) ? $('img', fig).alt : '', title, sub };
    });
    let idx = 0;

    const render = () => {
      const s = slides[idx];
      lbImg.src = s.src; lbImg.alt = s.alt;
      lbCap.innerHTML = s.title ? '<strong>' + s.title + '</strong> ' + s.sub : s.sub;
      lbCount.textContent = (idx + 1) + ' / ' + slides.length;
    };
    const go = (n) => { idx = (n + slides.length) % slides.length; render(); };
    const open = (i) => {
      idx = i; render();
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    shots.forEach((fig, i) => fig.addEventListener('click', () => open(i)));
    $('.lightbox__close', lb).addEventListener('click', close);
    $('.lightbox__nav--prev', lb).addEventListener('click', (e) => { e.stopPropagation(); go(idx - 1); });
    $('.lightbox__nav--next', lb).addEventListener('click', (e) => { e.stopPropagation(); go(idx + 1); });
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lightbox__stage')) close(); });
    window.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') go(idx - 1);
      else if (e.key === 'ArrowRight') go(idx + 1);
    });

    /* swipe on touch */
    let sx = 0;
    lb.addEventListener('touchstart', (e) => { sx = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ═══ shared modal system + WhatsApp number chooser ═══ */
  const WA_MAIN = '254707415444';   // primary — pops out first
  const WA_ALT = '254722449514';    // secondary
  let lastModalFocus = null;
  const openModal = (m) => {
    if (!m) return;
    lastModalFocus = document.activeElement;
    m.classList.add('open'); m.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    const f = m.querySelector('input,textarea,button'); if (f) setTimeout(() => f.focus(), 60);
  };
  const closeModal = (m) => {
    if (!m) return;
    m.classList.remove('open'); m.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (lastModalFocus && lastModalFocus.focus) lastModalFocus.focus();
  };
  $$('.modal').forEach((m) => {
    const x = $('.modal__close', m); if (x) x.addEventListener('click', () => closeModal(m));
    m.addEventListener('click', (e) => { if (e.target === m) closeModal(m); });
  });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.modal.open').forEach(closeModal); });

  /* WhatsApp chooser — lets the visitor pick either number, prefilled with the message */
  const waModal = $('#waModal');
  let waText = '';
  const openWhatsApp = (text) => {
    waText = text || '';
    if (waModal) openModal(waModal);
    else window.open('https://wa.me/' + WA_MAIN + (waText ? '?text=' + encodeURIComponent(waText) : ''), '_blank', 'noopener');
  };
  if (waModal) $$('.wa-num', waModal).forEach((b) => b.addEventListener('click', () => {
    window.open('https://wa.me/' + b.dataset.wa + (waText ? '?text=' + encodeURIComponent(waText) : ''), '_blank', 'noopener');
    closeModal(waModal);
  }));
  const waCta = $('#waCta');
  if (waCta) waCta.addEventListener('click', (e) => { e.preventDefault(); openWhatsApp("Hello Nissa, I'd love to plan a safari with you."); });

  /* contact form */
  const form = $('#cform');
  if (form) {
    const note = $('#cformNote');
    const submit = $('.cform__submit', form);
    const TO = 'nissasafaris254@gmail.com';

    const setNote = (msg, cls) => { note.textContent = msg; note.className = 'cform__note' + (cls ? ' ' + cls : ''); };
    const fieldOf = (el) => el.closest('.cfield');
    const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    form.querySelectorAll('input,textarea,select').forEach((el) => {
      el.addEventListener('input', () => fieldOf(el) && fieldOf(el).classList.remove('invalid'));
    });

    // validate (email optional — only checked when provided), then send via the chosen channel
    const send = (channel) => {
      const data = Object.fromEntries(new FormData(form).entries());
      let ok = true;
      const fail = (name) => {
        const el = form.querySelector('[name="' + name + '"]');
        if (el && fieldOf(el)) fieldOf(el).classList.add('invalid');
        ok = false;
      };
      if (!data.name || !data.name.trim()) fail('name');
      if (data.email && !validEmail(data.email)) fail('email');
      if (!data.message || data.message.trim().length < 10) fail('message');

      if (!ok) { setNote('Please add your name and a short message (and a valid email if you include one).', 'err'); return; }

      const first = data.name.split(' ')[0];
      const lines =
        'Name: ' + data.name + '\n' +
        'Email: ' + (data.email || 'not given') + '\n' +
        'Travel dates: ' + ((data.arrive || data.depart) ? ((data.arrive || '?') + ' to ' + (data.depart || '?')) : 'flexible') + '\n' +
        'Interested in: ' + (data.interest || 'open to suggestions') + '\n\n' +
        data.message;

      submit.disabled = true;
      if (channel === 'whatsapp') {
        setNote('Choose a WhatsApp number…', '');
        openWhatsApp('Safari enquiry\n\n' + lines);
      } else {
        setNote('Opening your email app…', '');
        const mailto = 'mailto:' + TO +
          '?subject=' + encodeURIComponent('Safari enquiry from ' + data.name) +
          '&body=' + encodeURIComponent(lines);
        window.location.href = mailto;
        setNote('Thank you, ' + first + '. Your message is ready to send from your email app.', 'ok');
      }
      form.reset();
      submit.disabled = false;
    };

    form.addEventListener('submit', (e) => { e.preventDefault(); send('whatsapp'); });
    const emailBtn = $('.cform__email', form);
    if (emailBtn) emailBtn.addEventListener('click', () => send('email'));
  }

  /* photo frames: load real image if present, else keep designed art */
  $$('.frame[data-photo]').forEach((frame) => {
    const src = frame.getAttribute('data-photo');
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      img.className = 'frame__photo';
      img.alt = frame.getAttribute('data-caption') || 'Nissa Ole Kinyaga';
      frame.insertBefore(img, frame.querySelector('.frame__cap'));
    };
    img.src = src;
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══ scroll parallax (drives --py on [data-parallax]) ═══ */
  const parallaxEls = $$('[data-parallax]');
  if (parallaxEls.length && !reduced) {
    let plxTick = false;
    const runParallax = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 2) return;       // skip off-screen
        const off = (rect.top + rect.height / 2 - vh / 2) / vh;   // ~ -1 (above) .. 1 (below)
        const f = parseFloat(el.dataset.parallax) || 0.1;
        el.style.setProperty('--py', (-off * f * 100).toFixed(1) + 'px');
      });
      plxTick = false;
    };
    window.addEventListener('scroll', () => { if (!plxTick) { requestAnimationFrame(runParallax); plxTick = true; } }, { passive: true });
    window.addEventListener('resize', runParallax, { passive: true });
    runParallax();
  }

  /* ═══ Reviews system ═══ */
  const reviewsGrid = $('#reviewsGrid');
  if (reviewsGrid) {
    /* === Curated reviews ===
       To publish a new (approved) review, add a line below.
       r = rating 1–5 · f = show in the main grid · a = author · p = place · t = text */
    const REVIEWS = [
      { r: 5, f: true, a: 'Safari Guests', p: 'Borana Conservancy', t: "Nissa grew up in the community neighbouring Borana and knows the area like the back of his hand. Tracking rhino at first light with him was the most profound thing we have ever done on safari." },
      { r: 5, f: true, a: 'Conservation Safari Review', p: 'Northern Kenya', t: "He educates you out in the field, showing endangered species and how their habitats are preserved. You leave understanding conservation, not just having watched it." },
      { r: 5, f: true, a: 'Luxury Safari Journal', p: 'East Africa', t: "A Silver Guide is rare for a reason. Nissa's calm, his eye for a leopard, his stories under the stars. This is guiding at world-class level." }
    ];
    const MAX_FEATURED = 3;

    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const stars = (n) => { n = Math.max(0, Math.min(5, Math.round(n))); return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); };
    const byBest = (a, b) => (b.r - a.r) || ((b.f ? 1 : 0) - (a.f ? 1 : 0));

    const all = REVIEWS.slice();
    const featuredPool = all.filter((r) => r.f).sort(byBest);
    const featured = (featuredPool.length ? featuredPool : all.slice().sort(byBest)).slice(0, MAX_FEATURED);

    /* rating summary */
    const avg = all.reduce((s, r) => s + r.r, 0) / (all.length || 1);
    const sumHTML = '<span class="sum__stars" aria-hidden="true">' + stars(avg) + '</span>' +
      '<span class="sum__txt"><b>' + avg.toFixed(1) + '</b> from ' + all.length + ' review' + (all.length === 1 ? '' : 's') + '</span>';
    const summary = $('#reviewSummary');
    if (summary) { summary.innerHTML = sumHTML; summary.hidden = false; }
    const allSummary = $('#allReviewsSummary');
    if (allSummary) allSummary.innerHTML = sumHTML;

    /* featured → grid */
    reviewsGrid.innerHTML = featured.map((r, i) =>
      '<figure class="quote reveal' + (i === 1 ? ' quote--accent' : '') + '">' +
        '<div class="quote__stars" aria-label="' + r.r + ' out of 5">' + stars(r.r) + '</div>' +
        '<p>“' + esc(r.t) + '”</p>' +
        '<figcaption><strong>' + esc(r.a) + '</strong><span>' + esc(r.p) + '</span></figcaption>' +
      '</figure>').join('');
    $$('.reveal', reviewsGrid).forEach((el) => io.observe(el));

    /* all → modal list */
    const allList = $('#allReviewsList');
    if (allList) allList.innerHTML = all.slice().sort(byBest).map((r) =>
      '<article class="rev">' +
        '<div class="rev__stars" aria-label="' + r.r + ' out of 5">' + stars(r.r) + '</div>' +
        '<p class="rev__text">“' + esc(r.t) + '”</p>' +
        '<p class="rev__by"><b>' + esc(r.a) + '</b>' + esc(r.p) + '</p>' +
      '</article>').join('');

    /* modal triggers (open/close helpers are shared, defined earlier) */
    const allModal = $('#allReviewsModal');
    const formModal = $('#reviewFormModal');

    const viewBtn = $('#viewAllReviews'); if (viewBtn) viewBtn.addEventListener('click', () => openModal(allModal));
    const leaveBtn = $('#leaveReview'); if (leaveBtn) leaveBtn.addEventListener('click', () => openModal(formModal));
    $$('[data-open-review]').forEach((b) => b.addEventListener('click', () => { closeModal(allModal); openModal(formModal); }));

    /* star-rating input */
    const starsInput = $('#starsInput');
    const ratingField = formModal && formModal.querySelector('[name="rating"]');
    let rating = 0;
    if (starsInput) {
      const starBtns = $$('.star', starsInput);
      const paint = (val) => starBtns.forEach((b, i) => { b.classList.toggle('on', i < val); b.setAttribute('aria-checked', String(i + 1 === val)); });
      starBtns.forEach((b) => {
        const v = Number(b.dataset.val);
        b.addEventListener('mouseenter', () => paint(v));
        b.addEventListener('focus', () => paint(v));
        b.addEventListener('click', () => { rating = v; if (ratingField) ratingField.value = String(v); paint(v); starsInput.closest('.cfield').classList.remove('invalid'); });
      });
      starsInput.addEventListener('mouseleave', () => paint(rating));
      starsInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') rating = Math.min(5, rating + 1);
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') rating = Math.max(1, rating - 1);
        else return;
        e.preventDefault(); if (ratingField) ratingField.value = String(rating); paint(rating);
      });
    }

    /* submit a review → moderated, sent to Nissa via WhatsApp / email */
    const rform = $('#rform');
    if (rform) {
      const note = $('#rformNote');
      const setNote = (msg, cls) => { note.textContent = msg; note.className = 'cform__note' + (cls ? ' ' + cls : ''); };
      const fieldOf = (el) => el.closest('.cfield');
      const TO = 'nissasafaris254@gmail.com';

      rform.querySelectorAll('input,textarea').forEach((el) => {
        el.addEventListener('input', () => fieldOf(el) && fieldOf(el).classList.remove('invalid'));
      });

      const sendReview = (channel) => {
        const data = Object.fromEntries(new FormData(rform).entries());
        let ok = true;
        const fail = (name) => { const el = rform.querySelector('[name="' + name + '"]'); if (el && fieldOf(el)) fieldOf(el).classList.add('invalid'); ok = false; };
        if (!data.name || !data.name.trim()) fail('name');
        if (!data.text || data.text.trim().length < 10) fail('text');
        if (!rating) { ok = false; if (starsInput) starsInput.closest('.cfield').classList.add('invalid'); }
        if (!ok) { setNote('Please add your name, a rating, and a few words.', 'err'); return; }

        const lines = 'New review for Nissa\n\n' +
          'Name: ' + data.name + '\n' +
          (data.place ? 'From: ' + data.place + '\n' : '') +
          'Rating: ' + rating + '/5 (' + stars(rating) + ')\n\n' +
          data.text;

        if (channel === 'whatsapp') {
          setNote('Choose a WhatsApp number…', '');
          closeModal(formModal);
          openWhatsApp(lines);
        } else {
          setNote('Opening your email app…', '');
          window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent('New review for Nissa from ' + data.name) + '&body=' + encodeURIComponent(lines);
          setNote('Thank you, ' + data.name.split(' ')[0] + '. Nissa will add your review once it reaches him.', 'ok');
        }
        rform.reset(); rating = 0; if (ratingField) ratingField.value = '';
        if (starsInput) $$('.star', starsInput).forEach((b) => { b.classList.remove('on'); b.setAttribute('aria-checked', 'false'); });
      };

      rform.addEventListener('submit', (e) => { e.preventDefault(); sendReview('whatsapp'); });
      const rEmail = $('.rform__email', rform);
      if (rEmail) rEmail.addEventListener('click', () => sendReview('email'));
    }

    /* exit-intent review prompt (once per visitor) */
    const prompt = $('#reviewPrompt');
    let promptSeen = false;
    try { promptSeen = !!localStorage.getItem('nk_review_prompt'); } catch (_) {}
    if (prompt && !promptSeen) {
      let shown = false;
      const remember = () => { try { localStorage.setItem('nk_review_prompt', '1'); } catch (_) {} };
      const hide = () => { prompt.classList.remove('show'); prompt.setAttribute('aria-hidden', 'true'); };
      const reveal = () => { if (shown) return; shown = true; remember(); prompt.classList.add('show'); prompt.setAttribute('aria-hidden', 'false'); };

      $('.revprompt__x', prompt).addEventListener('click', hide);
      $('.revprompt__cta', prompt).addEventListener('click', hide);

      if (matchMedia('(hover:hover)').matches) {
        document.addEventListener('mouseout', (e) => { if (!e.relatedTarget && e.clientY <= 0) reveal(); });
      }
      window.addEventListener('scroll', () => {
        const doc = document.documentElement;
        if ((window.scrollY + window.innerHeight) / doc.scrollHeight > 0.7) reveal();
      }, { passive: true });
    }
  }
})();
