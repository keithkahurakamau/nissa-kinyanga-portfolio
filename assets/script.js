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
  if (burger) burger.addEventListener('click', () => {
    const open = links.style.display === 'flex';
    links.style.display = open ? '' : 'flex';
    links.style.cssText = open ? '' :
      'display:flex;position:fixed;inset:64px 1rem auto 1rem;flex-direction:column;gap:1.2rem;' +
      'background:rgba(236,226,210,.96);backdrop-filter:blur(18px);padding:1.6rem;border-radius:20px;' +
      'box-shadow:0 30px 60px -20px rgba(45,30,18,.4);z-index:999';
  });
  $$('.nav__links a').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth <= 720) links.style.cssText = '';
  }));

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

  /* contact form */
  const form = $('#cform');
  if (form) {
    const note = $('#cformNote');
    const submit = $('.cform__submit', form);
    const TO = 'bookings@lengishu.com'; // swap for Nissa's address or a form endpoint

    const setNote = (msg, cls) => { note.textContent = msg; note.className = 'cform__note' + (cls ? ' ' + cls : ''); };
    const fieldOf = (el) => el.closest('.cfield');
    const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    form.querySelectorAll('input,textarea,select').forEach((el) => {
      el.addEventListener('input', () => fieldOf(el) && fieldOf(el).classList.remove('invalid'));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      let ok = true;
      const fail = (name) => {
        const el = form.querySelector('[name="' + name + '"]');
        if (el && fieldOf(el)) fieldOf(el).classList.add('invalid');
        ok = false;
      };
      if (!data.name || !data.name.trim()) fail('name');
      if (!validEmail(data.email || '')) fail('email');
      if (!data.message || data.message.trim().length < 10) fail('message');

      if (!ok) { setNote('Please fill in your name, a valid email, and a short message.', 'err'); return; }

      submit.disabled = true;
      setNote('Opening your email app…', '');

      const subject = 'Safari enquiry from ' + data.name;
      const body =
        'Name: ' + data.name + '\n' +
        'Email: ' + data.email + '\n' +
        'Travel dates: ' + (data.dates || 'flexible') + '\n' +
        'Interested in: ' + (data.interest || 'open to suggestions') + '\n\n' +
        data.message;
      const mailto = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      setTimeout(() => {
        window.location.href = mailto;
        setNote('Thank you, ' + data.name.split(' ')[0] + '. Your message is ready to send from your email app.', 'ok');
        form.reset();
        submit.disabled = false;
      }, 400);
    });
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
})();
