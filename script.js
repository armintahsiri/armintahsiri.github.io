const CONFIG = {
  email: '',
  phone: '09135561741',
  telegram: 'https://t.me/Armiinths',
  linkedin: '',
  tryhackme: '',
  portswigger: '',
  formEndpoint: 'https://api.web3forms.com/submit',
  formAccessKey: '7af2702d-dce8-4820-bfbb-a8392bb61fe4'
};

const initPortfolio = () => {
  const header = document.getElementById('site-header');
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const modal = document.getElementById('collab-modal');
  const modalOpeners = [...document.querySelectorAll('[data-open-modal]')];
  const modalClosers = [...document.querySelectorAll('[data-close-modal]')];
  const form = document.getElementById('collab-form');
  const status = document.getElementById('modal-status');
  let lastFocusedElement = null;

  const setStatus = (message, isError = false) => {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
  };

  const closeMenu = () => {
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };

  const openModal = opener => {
    if (!modal) return;
    closeMenu();
    lastFocusedElement = opener || document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.removeAttribute('inert');
    document.body.classList.add('modal-open');
    window.requestAnimationFrame(() => window.setTimeout(() => modal.querySelector('input, select, textarea')?.focus(), 0));
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('inert', '');
    document.body.classList.remove('modal-open');
    lastFocusedElement?.focus();
  };

  const renderConfigLinks = () => {
    document.querySelectorAll('[data-config-link]').forEach(link => {
      const key = link.dataset.configLink;
      const value = CONFIG[key];
      if (!value) {
        link.hidden = true;
        return;
      }
      link.hidden = false;
      link.href = key === 'email' ? `mailto:${value}` : key === 'phone' ? `tel:${value}` : value;
      if (key === 'email' || key === 'phone') link.textContent = `${value} ↗`;
      if (key === 'telegram') link.textContent = 'Telegram ↗';
      if (key === 'linkedin') link.textContent = 'LinkedIn ↗';
      if (key === 'phone') link.setAttribute('aria-label', 'تماس تلفنی');
    });

    document.querySelectorAll('[data-profile-links]').forEach(container => {
      const profiles = [['tryhackme', 'TryHackMe'], ['portswigger', 'PortSwigger']].filter(([key]) => CONFIG[key]);
      container.replaceChildren(...profiles.map(([key, label]) => {
        const link = document.createElement('a');
        link.href = CONFIG[key];
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = `${label} ↗`;
        return link;
      }));
      container.hidden = profiles.length === 0;
    });
  };

  const renderProjectLinks = () => {
    document.querySelectorAll('.project-links').forEach(container => {
      const links = [['repo', 'مخزن GitHub'], ['demo', 'دموی زنده']].filter(([key]) => container.dataset[key]);
      container.replaceChildren(...links.map(([key, label]) => {
        const link = document.createElement('a');
        link.href = container.dataset[key];
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = `${label} ↗`;
        return link;
      }));
      container.hidden = links.length === 0;
    });
  };

  const validateForm = data => {
    if (data.get('company')) return false;
    if (!data.get('name')?.trim() || !data.get('email')?.trim() || !data.get('project') || !data.get('message')?.trim()) {
      setStatus('لطفاً فیلدهای ضروری را کامل کنید.', true);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get('email').trim())) {
      setStatus('لطفاً یک ایمیل معتبر وارد کنید.', true);
      return false;
    }
    return true;
  };

  const submitForm = async event => {
    event.preventDefault();
    const data = new FormData(form);
    if (!validateForm(data)) return;
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    setStatus('در حال ارسال درخواست...');
    const payload = {
      name: data.get('name').trim(),
      email: data.get('email').trim(),
      project: data.get('project'),
      message: data.get('message').trim(),
      resources: data.get('resources')?.trim() || '',
      access_key: CONFIG.formAccessKey,
      subject: `درخواست همکاری جدید - ${data.get('project')}`,
      from_name: 'Armin Tahsiri Portfolio'
    };

    try {
      if (CONFIG.formEndpoint && CONFIG.formAccessKey) {
        const response = await fetch(CONFIG.formEndpoint, { method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify(payload) });
        const result = await response.json().catch(() => ({success: false}));
        if (!response.ok || !result.success) throw new Error(result.message || 'form-request-failed');
        setStatus('درخواست شما با موفقیت ارسال شد.');
        form.reset();
      } else if (CONFIG.email) {
        const subject = `درخواست همکاری - ${payload.project}`;
        const body = `نام: ${payload.name}\nایمیل: ${payload.email}\nنوع پروژه: ${payload.project}\n\nتوضیحات:\n${payload.message}\n\nلینک یا ابزارهای موجود:\n${payload.resources || 'ذکر نشده'}`;
        window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus('در حال باز کردن برنامه ایمیل شما...');
      } else {
        setStatus('فرم همکاری هنوز پیکربندی نشده است. لطفاً از مسیر ارتباطی دیگری پیام بدهید.', true);
      }
    } catch {
      setStatus('ارسال درخواست انجام نشد. لطفاً دوباره تلاش کنید.', true);
    } finally {
      button.disabled = false;
    }
  };

  modalOpeners.forEach(opener => opener.addEventListener('click', event => { event.preventDefault(); openModal(opener); }));
  modalClosers.forEach(closer => closer.addEventListener('click', closeModal));
  form?.addEventListener('submit', submitForm);
  toggle?.addEventListener('click', () => { const isOpen = nav?.classList.toggle('is-open') ?? false; toggle.setAttribute('aria-expanded', String(isOpen)); });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (modal?.classList.contains('is-open')) closeModal();
      else { closeMenu(); toggle?.focus(); }
    }
    if (event.key !== 'Tab' || !modal?.classList.contains('is-open')) return;
    const focusable = [...modal.querySelectorAll('button, input, select, textarea, a[href]:not([hidden])')].filter(element => !element.disabled && !element.closest('[hidden]'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('click', event => { if (nav?.classList.contains('is-open') && !nav.contains(event.target) && !toggle?.contains(event.target)) closeMenu(); });

  let ticking = false;
  window.addEventListener('scroll', () => { if (ticking) return; window.requestAnimationFrame(() => { header?.classList.toggle('is-scrolled', window.scrollY > 20); ticking = false; }); ticking = true; }, {passive: true});
  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`)); }), {rootMargin: '-35% 0px -55% 0px', threshold: 0});
    sections.forEach(section => observer.observe(section));
  }
  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();
  renderConfigLinks();
  renderProjectLinks();
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPortfolio, {once: true});
else initPortfolio();
