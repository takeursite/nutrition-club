(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ---------------- Language ---------------- */
  const RU = window.SP_RU || {};
  let lang = 'en';
  try { if (localStorage.getItem('sp-lang') === 'ru') lang = 'ru'; } catch (e) {}
  const tr = (s) => (lang === 'ru' && RU[s]) || s;
  const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D1A22" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';

  /* ---------------- Plate builder ---------------- */
  const FOODS = [
    { id: 'chicken', name: 'Chicken', short: 'Chicken', color: '#F2C9A0', p: 30, f: 0, s: 0 },
    { id: 'salmon', name: 'Salmon', short: 'Salmon', color: '#F6B7A3', p: 25, f: 0, s: 0 },
    { id: 'eggs', name: 'Two eggs', short: 'Eggs', color: '#F6E4A6', p: 13, f: 0, s: 0 },
    { id: 'lentils', name: 'Lentils', short: 'Lentils', color: '#D7B98E', p: 9, f: 8, s: 0 },
    { id: 'broccoli', name: 'Broccoli', short: 'Broccoli', color: '#A9D59A', p: 3, f: 5, s: 0 },
    { id: 'greens', name: 'Greens', short: 'Greens', color: '#CFEBD6', p: 1, f: 3, s: 0 },
    { id: 'rice', name: 'Brown rice', short: 'Rice', color: '#E6D3B3', p: 5, f: 3, s: 0 },
    { id: 'pasta', name: 'Pasta', short: 'Pasta', color: '#F3E2B5', p: 7, f: 2, s: 0 },
    { id: 'bread', name: 'Bread', short: 'Bread', color: '#E8C99A', p: 4, f: 1, s: 3 },
    { id: 'fries', name: 'Fries', short: 'Fries', color: '#F2D27A', p: 3, f: 3, s: 0 },
    { id: 'apple', name: 'Apple', short: 'Apple', color: '#F5A5A5', p: 0, f: 4, s: 0 },
    { id: 'soda', name: 'Soda', short: 'Soda', color: '#C9B7E8', p: 0, f: 0, s: 35 },
    { id: 'brownie', name: 'Brownie', short: 'Brownie', color: '#B89282', p: 2, f: 1, s: 24 },
    { id: 'juice', name: 'Juice', short: 'Juice', color: '#F7C77E', p: 1, f: 0, s: 21 }
  ];
  const ICONS = {
    chicken: '<path d="M14.5 4c3.200 0 5.500 2.400 5.500 5.200 0 3.300-2.800 5-5.400 5.500l-2.200 2.200a1.800 1.800 0 0 1-2.500 0l-.4-.4a1.800 1.800 0 0 1 0-2.500l2-2C11.500 7.200 12.100 4 14.500 4z"/><path d="M8.300 15.700l-2 2a1.600 1.600 0 1 0-1.800 2.200 1.600 1.600 0 0 0 2.200-1.800l2-2"/>',
    salmon: '<path d="M2.500 12c3-4.600 8.500-5.600 12.500-3l5.500-3.200v12.400L15 15c-4 2.600-9.500 1.600-12.500-3z"/><circle cx="8" cy="11" r=".9" fill="#1D1A22"/><path d="M12 9.500c.8 1.500.8 3.500 0 5"/>',
    eggs: '<path d="M12 4c4.200 0 8 2.600 7.500 7.300C19 15.700 16 20 11.500 19.500 7 19 4 15.500 4.500 11 5 7 8 4 12 4z" fill="#fff"/><circle cx="12" cy="12" r="3.200" fill="#F2B84B"/>',
    lentils: '<ellipse cx="8" cy="9" rx="3.400" ry="2.200" transform="rotate(-30 8 9)"/><ellipse cx="16" cy="9.500" rx="3.400" ry="2.200" transform="rotate(25 16 9.500)"/><ellipse cx="12" cy="16" rx="3.400" ry="2.200" transform="rotate(-8 12 16)"/>',
    broccoli: '<circle cx="8.500" cy="10" r="3.600" fill="#7FBF8E"/><circle cx="15.500" cy="10" r="3.600" fill="#7FBF8E"/><circle cx="12" cy="7" r="3.600" fill="#7FBF8E"/><path d="M10 13l-.8 7h5.600L14 13" fill="#CFEBD6"/>',
    greens: '<path d="M4.500 19.500C4 10.500 9.500 4.500 19.500 4.500c.4 9.500-5.500 15-15 15z" fill="#7FBF8E"/><path d="M4.500 19.500L13 11"/>',
    rice: '<path d="M3.500 11.500h17a8.500 8 0 0 1-17 0z" fill="#fff"/><path d="M7.500 11c0-2.800 1.700-4.500 4.500-4.500s4.500 1.700 4.500 4.500" fill="#fff"/><path d="M10 9.500h.01M13.500 8.500h.01M14.500 10.500h.01"/>',
    pasta: '<ellipse cx="12" cy="15.500" rx="8.500" ry="3.500" fill="#fff"/><path d="M5.500 14c1-5 4-7.500 6.500-7.500s5.500 2.500 6.500 7.500"/><path d="M9 14c.5-3 2-4.600 3-4.600s2.500 1.600 3 4.600"/>',
    bread: '<path d="M6.500 19.500v-8C3.800 11 3.500 6.500 7.500 5.800c1.500-.4 2.700-.5 4.500-.5s3 .1 4.500.5c4 .7 3.700 5.200 1 5.700v8z" fill="#fff"/>',
    fries: '<path d="M7 11l1-6.500M11 11l.4-7.500M15 11l-.4-7M18 11l-1.500-6" stroke="#B57F14" stroke-width="2.200"/><path d="M5.500 10.500h13l-1.500 9.500H7z" fill="#fff"/>',
    apple: '<path d="M12 8c-2.200-1.600-6.500-1-6.500 4 0 4 2.800 8 5 8 1 0 1-.5 1.500-.5s.5.500 1.500.5c2.200 0 5-4 5-8 0-5-4.300-5.600-6.500-4z" fill="#fff"/><path d="M12 8c0-2 1-3.500 3-4.200"/>',
    soda: '<path d="M7 8.500h10L15.800 20H8.200z" fill="#fff"/><path d="M6 8.500h12"/><path d="M13.500 8.500l1.500-4.800h2.500"/><path d="M7.500 13h9" />',
    brownie: '<path d="M4.500 9.500l7.500-3 7.500 3v7l-7.500 3-7.500-3z" fill="#fff"/><path d="M4.500 9.500L12 12.500l7.500-3M12 12.500v7"/><path d="M8 9.500h.01M14.500 8.500h.01M16.500 14.500h.01"/>',
    juice: '<path d="M6.500 7h11l-1 13h-9z" fill="#fff"/><path d="M7 11.500h10" /><circle cx="17.500" cy="6" r="2.800" fill="#F7C77E"/>'
  };
  const icon = (id, size) => `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#1D1A22" stroke-width="1.500" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[id]}</svg>`;
  const MAX = 6;
  const plateEl = $('#plate');
  const emptyEl = $('#plate-empty');
  const fullNote = $('#full-note');
  const metersEl = $('#meters');
  const verdictEl = $('#verdict');
  let plate = [];
  const chips = new Map();
  const items = new Map();

  FOODS.forEach((f, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.draggable = true;
    b.setAttribute('aria-pressed', 'false');
    b.dataset.id = f.id;
    b.innerHTML = `<span class="chip-dot" style="background:${f.color}">${icon(f.id, 22)}${CHECK.replace('<svg ', '<svg class="chk" ')}</span><span class="cn">${tr(f.name)}</span>`;
    b.addEventListener('click', () => toggle(f.id));
    b.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', f.id);
      e.dataTransfer.effectAllowed = 'copy';
    });
    chips.set(f.id, b);
    $(i < 7 ? '#tray-left' : '#tray-right').appendChild(b);
  });

  const METERS = [
    { key: 'p', label: 'Protein', max: 40, mark: 62.5, goal: 25, value: (v) => `${v} / 25 ${lang === 'ru' ? 'г' : 'g'}`, bad: (v) => v < 25, badText: 'Not enough protein', goodText: 'Protein on point', bar: '#7FBF8E', badBar: '#E8A56B' },
    { key: 'f', label: 'Fiber', max: 16, mark: 62.5, goal: 10, value: (v) => `${v} / 10 ${lang === 'ru' ? 'г' : 'g'}`, bad: (v) => v < 10, badText: 'Fiber is low', goodText: 'Fiber looks good', bar: '#7FBF8E', badBar: '#E8A56B' },
    { key: 's', label: 'Sugar', max: 40, mark: 25, goal: 10, value: (v) => lang === 'ru' ? `${v} г · макс. 10` : `${v} g · max 10`, bad: (v) => v > 10, badText: 'Sugar over the limit', goodText: 'Sugar in check', bar: '#7FBF8E', badBar: '#E07A8F' }
  ];
  const meterEls = METERS.map((m) => {
    const d = document.createElement('div');
    d.className = 'meter';
    d.innerHTML = `<div class="meter-top"><span data-label>${tr(m.label)}</span><span data-v></span></div><div class="track"><div class="fill" data-fill></div><div class="mark" style="left:${m.mark}%"></div></div><span class="status" data-st></span>`;
    metersEl.appendChild(d);
    return { m, lab: $('[data-label]', d), v: $('[data-v]', d), fill: $('[data-fill]', d), st: $('[data-st]', d) };
  });

  const byId = (id) => FOODS.find((f) => f.id === id);
  const join = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);

  function positions(n) {
    if (n === 1) return [[50, 50]];
    return Array.from({ length: n }, (_, i) => {
      const a = (-90 + (360 / n) * i) * Math.PI / 180;
      return [50 + 28.8 * Math.cos(a), 50 + 28.8 * Math.sin(a)];
    });
  }

  function render() {
    const foods = plate.map(byId);
    const n = foods.length;
    // chips
    chips.forEach((b, id) => {
      const on = plate.includes(id);
      b.setAttribute('aria-pressed', on);
      b.draggable = !on;
    });
    // plate items
    items.forEach((el, id) => {
      if (!plate.includes(id)) {
        items.delete(id);
        el.classList.add('out');
        setTimeout(() => el.remove(), reduceMotion ? 0 : 220);
      }
    });
    const pos = positions(n);
    foods.forEach((f, i) => {
      let el = items.get(f.id);
      if (!el) {
        el = document.createElement('button');
        el.type = 'button';
        el.className = 'item';
        el.innerHTML = `<span class="dot" style="background:${f.color}">${icon(f.id, 34)}</span><span class="tag"></span>`;
        el.addEventListener('click', () => remove(f.id));
        plateEl.appendChild(el);
        items.set(f.id, el);
      }
      el.setAttribute('aria-label', (lang === 'ru' ? 'Убрать: ' : 'Remove ') + tr(f.name));
      $('.tag', el).textContent = tr(f.short);
      el.style.left = pos[i][0] + '%';
      el.style.top = pos[i][1] + '%';
    });
    emptyEl.hidden = n > 0;
    fullNote.hidden = n < MAX;

    // meters
    const tot = { p: 0, f: 0, s: 0 };
    foods.forEach((f) => { tot.p += f.p; tot.f += f.f; tot.s += f.s; });
    const probs = [];
    meterEls.forEach(({ m, lab, v, fill, st }) => {
      lab.textContent = tr(m.label);
      const val = tot[m.key];
      if (!n) {
        v.textContent = m.value(0);
        fill.style.width = '100%';
        fill.style.background = 'var(--lilac)';
        fill.style.opacity = '.5';
        st.textContent = tr('Waiting for food');
        st.className = 'status';
        return;
      }
      const bad = m.bad(val);
      v.textContent = m.value(val);
      fill.style.opacity = '1';
      fill.style.width = Math.min(100, (val / m.max) * 100) + '%';
      fill.style.background = bad ? m.badBar : m.bar;
      st.textContent = tr(bad ? m.badText : m.goodText);
      st.className = 'status ' + (bad ? 'warn' : 'ok');
      if (bad) probs.push(m.key);
    });
    if (!n) {
      // empty state: bars sit at 0 visually
      meterEls.forEach(({ fill }) => { fill.style.width = '0%'; });
      verdictEl.textContent = lang === 'ru' ? 'Соберите свой обычный обед и посмотрите, чего ему не хватает. Регистрация не нужна.' : 'Build your usual lunch and see what it’s missing. No sign-up needed.';
    } else if (!probs.length) {
      verdictEl.textContent = lang === 'ru' ? 'Отличный баланс — такая тарелка насыщает до самого ужина.' : 'Nicely balanced — the kind of plate that keeps you full until dinner.';
    } else if (lang === 'ru') {
      const lack = probs.filter((k) => k !== 's').map((k) => (k === 'p' ? 'белка' : 'клетчатки'));
      const parts = [];
      if (lack.length) parts.push('не хватает ' + lack.join(' и '));
      if (probs.includes('s')) parts.push('слишком много сахара');
      verdictEl.textContent = `В вашем обеде ${parts.join(' и ')}. Пара простых замен это исправит.`;
    } else {
      const words = probs.map((k) => (k === 'p' ? 'short on protein' : k === 'f' ? 'low on fiber' : 'heavy on sugar'));
      verdictEl.textContent = `Your lunch is ${join(words)}. A couple of easy swaps would fix that.`;
    }
  }

  function add(id) {
    if (plate.includes(id) || plate.length >= MAX) return;
    plate.push(id);
    render();
  }
  function remove(id) { plate = plate.filter((x) => x !== id); render(); }
  function toggle(id) { plate.includes(id) ? remove(id) : add(id); }

  $('#clear').addEventListener('click', () => { plate = []; render(); });
  plateEl.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
  plateEl.addEventListener('dragenter', (e) => { e.preventDefault(); plateEl.classList.add('over'); });
  plateEl.addEventListener('dragleave', (e) => { if (!plateEl.contains(e.relatedTarget)) plateEl.classList.remove('over'); });
  plateEl.addEventListener('drop', (e) => {
    e.preventDefault();
    plateEl.classList.remove('over');
    const id = e.dataTransfer.getData('text/plain');
    if (byId(id)) add(id);
  });
  render();

  /* ---------------- Program tabs / accordion ---------------- */
  const WEEKS = [
    { n: '01', title: 'The balanced plate', text: 'Build a plate that keeps you full for hours, and find a meal rhythm that fits your actual day.', items: ['Plate builder guide', '3-day starter menu', 'Live Q&A'], color: '#E79BBE' },
    { n: '02', title: 'Taming sugar cravings', text: 'Why the 9 pm cookie happens, and how to handle it without banning anything.', items: ['Craving tracker', 'Snack swap list', 'Live session'], color: '#7FBF8E' },
    { n: '03', title: 'Protein & fullness', text: 'How much protein you really need, and how to get it from normal food — no shakes required.', items: ['Protein calculator', '10 quick breakfasts', 'Diary review'], color: '#8DB6E2' },
    { n: '04', title: 'Eating out, stress-free', text: 'Restaurants, parties, travel. Stay on track without being “that person” at the table.', items: ['Menu cheat sheet', 'Travel snack kit', 'Graduation call'], color: '#D9AE45' }
  ];
  const mqMobile = matchMedia('(max-width: 900px)');
  const tabs = $$('[role="tab"]');
  const tick = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E4C66" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';
  let week = mqMobile.matches ? -1 : 0;

  function renderMob() {
    WEEKS.forEach((w, i) => {
      $('#mob-' + i).innerHTML = `<p>${tr(w.text)}</p><div>${w.items.map((t) => `<span>${tr(t)}</span>`).join('')}</div>`;
    });
  }
  renderMob();

  function renderWeek() {
    tabs.forEach((t, i) => {
      const sel = i === week;
      t.setAttribute('aria-selected', sel);
      t.tabIndex = sel || (week === -1 && i === 0) ? 0 : -1;
      $('#mob-' + i).hidden = !sel;
    });
    const w = WEEKS[Math.max(week, 0)];
    $('#wk-num').textContent = w.n;
    $('#wk-num').style.color = w.color;
    $('#wk-badge').textContent = lang === 'ru' ? `Неделя ${+w.n} из 4` : `Week ${+w.n} of 4`;
    $('#wk-title').textContent = tr(w.title);
    $('#wk-text').textContent = tr(w.text);
    $('#wk-items').innerHTML = w.items.map((t) => `<div>${tick}${tr(t)}</div>`).join('');
    $('#panel').setAttribute('aria-labelledby', 'tab-' + Math.max(week, 0));
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => {
      week = mqMobile.matches && week === i ? -1 : i;
      renderWeek();
    });
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
      const j = (i + d + tabs.length) % tabs.length;
      week = j;
      renderWeek();
      tabs[j].focus();
    });
  });
  mqMobile.addEventListener('change', (e) => {
    week = e.matches ? -1 : Math.max(week, 0);
    renderWeek();
  });
  renderWeek();

  /* ---------------- Pricing toggle ---------------- */
  const PRICES = { month: ['$19', '$29', '$149', '/ month'], quarter: ['$49', '$74', '$379', '/ 3 months'] };
  const pbtns = $$('[data-period]');
  let period = 'month';
  function setPeriod(p) {
    period = p;
    pbtns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.period === p));
    $$('[data-price]').forEach((el) => { el.textContent = PRICES[p][+el.dataset.price - 1]; });
    $$('[data-per]').forEach((el) => { el.textContent = tr(PRICES[p][3]); });
  }
  pbtns.forEach((b) => b.addEventListener('click', () => setPeriod(b.dataset.period)));
  setPeriod('month');

  /* ---------------- FAQ ---------------- */
  $$('.faq-q').forEach((q) => {
    q.addEventListener('click', () => {
      const open = q.getAttribute('aria-expanded') === 'true';
      q.setAttribute('aria-expanded', !open);
      $('.faq-sign', q).textContent = open ? '+' : '−';
      $('#' + q.getAttribute('aria-controls')).hidden = open;
    });
  });

  /* ---------------- Email form ---------------- */
  const form = $('#join-form');
  const msg = $('#form-msg');
  const input = $('#email');
  let msgKey = '';
  const setMsg = (k, cls) => { msgKey = k; msg.textContent = k ? tr(k) : ''; msg.className = 'form-msg ' + (cls || ''); };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v)) {
      setMsg('Please enter a valid email address.', 'err');
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    setMsg('You’re on the list!', 'ok');
    input.value = '';
  });

  /* ---------------- Sticky CTA (mobile) ---------------- */
  const sticky = $('#sticky');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => {
      sticky.classList.toggle('show', !en.isIntersecting && en.boundingClientRect.top < 0);
    }).observe($('#hero-cta'));
  }

  /* ---------------- Header: hide on scroll down, show on scroll up ---------------- */
  const header = $('#site-header');
  const spacer = $('#nav-spacer');
  let lastY = 0;
  const setSpacer = () => {
    const was = header.classList.contains('scrolled');
    header.classList.remove('scrolled');
    spacer.style.setProperty('--nav-h', header.offsetHeight + 'px');
    if (was) header.classList.add('scrolled');
  };
  function onScroll() {
    const y = Math.max(0, window.scrollY);
    header.classList.toggle('scrolled', y > 24);
    if (y < 90) { header.classList.remove('hide'); lastY = y; return; }
    const d = y - lastY;
    if (Math.abs(d) < 6) return;
    lastY = y;
    if (d > 0 && !header.matches(':focus-within')) header.classList.add('hide');
    else if (d < 0) header.classList.remove('hide');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('hide'));
  window.addEventListener('resize', setSpacer);
  setSpacer();
  onScroll();

  /* ---------------- Language switch ---------------- */
  const SKIP = '#tray-left,#tray-right,#meters,#verdict,#panel,.wk-mobile,#form-msg,[data-price],[data-per],.item,script,style,svg';
  const textOrig = new WeakMap();
  function translateStatic() {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      if (n.parentElement.closest(SKIP)) continue;
      let o = textOrig.get(n);
      if (o === undefined) { o = n.nodeValue; textOrig.set(n, o); }
      const k = o.replace(/\s+/g, ' ').trim();
      if (!k) continue;
      n.nodeValue = lang === 'ru' && RU[k] ? o.match(/^\s*/)[0] + RU[k] + o.match(/\s*$/)[0] : o;
    }
    $$('[aria-label],[alt]').forEach((el) => {
      if (el.closest('.item')) return;
      ['aria-label', 'alt'].forEach((a) => {
        if (!el.hasAttribute(a)) return;
        const key = 'o' + a.replace('-', '');
        if (el.dataset[key] === undefined) el.dataset[key] = el.getAttribute(a);
        const o = el.dataset[key];
        el.setAttribute(a, lang === 'ru' && RU[o] ? RU[o] : o);
      });
    });
  }
  const metaEls = [
    [document.querySelector('meta[name="description"]'), '@description'],
    [document.querySelector('meta[property="og:title"]'), '@title'],
    [document.querySelector('meta[property="og:description"]'), '@ogDescription']
  ];
  const titleEn = document.title;
  function applyLang(l) {
    lang = l;
    try { localStorage.setItem('sp-lang', l); } catch (e) {}
    document.documentElement.lang = l;
    translateStatic();
    document.title = l === 'ru' ? RU['@title'] : titleEn;
    metaEls.forEach(([el, key]) => {
      if (!el) return;
      if (el.dataset.en === undefined) el.dataset.en = el.getAttribute('content');
      el.setAttribute('content', l === 'ru' ? RU[key] : el.dataset.en);
    });
    $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === l));
    chips.forEach((b, id) => { $('.cn', b).textContent = tr(byId(id).name); });
    render();
    renderMob();
    renderWeek();
    setPeriod(period);
    if (msgKey) msg.textContent = tr(msgKey);
    setSpacer();
  }
  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  applyLang(lang);
})();
