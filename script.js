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

const initHeroCube = () => {
  const container = document.querySelector('.hero-network');
  const canvas = document.getElementById('hero-network-canvas');
  if (!container || !canvas) return;
  if (!window.THREE || !window.WebGLRenderingContext) {
    canvas.hidden = true;
    return;
  }

  const THREE = window.THREE;
  let renderer;
  const showFallback = () => {
    canvas.hidden = true;
    container.classList.remove('is-ready');
  };

  try {
    renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: 'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf7f6f3, 4.8, 9.2);
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 20);
    camera.position.set(0, 0, 6.4);
    const assembly = new THREE.Group();
    scene.add(assembly);

    const primaryMaterial = new THREE.LineBasicMaterial({color: 0x16171a, transparent: true, opacity: .9, linewidth: 2});
    const secondaryMaterial = new THREE.LineBasicMaterial({color: 0x4a4c51, transparent: true, opacity: .34, linewidth: 1});
    const accentMaterial = new THREE.LineBasicMaterial({color: 0xc1272d, transparent: true, opacity: .68, linewidth: 1});
    const wireframes = [];
    const addWireframe = (geometry, material, position, rotation, drawDelay = 0) => {
      const edgeGeometry = new THREE.EdgesGeometry(geometry);
      const object = new THREE.LineSegments(edgeGeometry, material);
      object.position.copy(position);
      object.rotation.copy(rotation);
      object.renderOrder = 2;
      assembly.add(object);
      wireframes.push({geometry: edgeGeometry, total: edgeGeometry.getAttribute('position').count, delay: drawDelay});
      return object;
    };

    const mainCube = addWireframe(new THREE.BoxGeometry(1.46, 1.46, 1.46), primaryMaterial, new THREE.Vector3(0, 0, 0), new THREE.Euler(), 0);
    const weightMaterial = new THREE.LineBasicMaterial({color: 0x16171a, transparent: true, opacity: .18, linewidth: 3});
    const weightLayer = new THREE.LineSegments(mainCube.geometry, weightMaterial);
    weightLayer.scale.setScalar(1.006);
    weightLayer.renderOrder = 1;
    assembly.add(weightLayer);

    const addPanel = (geometry, lineMaterial, position, rotation, drawDelay, fillMaterial) => {
      if (fillMaterial) {
        const fill = new THREE.Mesh(geometry, fillMaterial);
        fill.position.copy(position);
        fill.rotation.copy(rotation);
        fill.renderOrder = 1;
        assembly.add(fill);
      }
      addWireframe(geometry, lineMaterial, position, rotation, drawDelay);
    };
    const accentFill = new THREE.MeshBasicMaterial({color: 0xc1272d, transparent: true, opacity: .14, side: THREE.DoubleSide, depthWrite: false});
    addPanel(new THREE.PlaneGeometry(1.08, 1.08), secondaryMaterial, new THREE.Vector3(.08, .06, .86), new THREE.Euler(0, 0, 0), .12);
    addPanel(new THREE.PlaneGeometry(1.08, 1.08), accentMaterial, new THREE.Vector3(.9, .1, .08), new THREE.Euler(0, Math.PI / 2, 0), .24, accentFill);
    addPanel(new THREE.PlaneGeometry(1.08, 1.08), secondaryMaterial, new THREE.Vector3(.1, .9, -.08), new THREE.Euler(-Math.PI / 2, 0, 0), .36);

    const createGlowTexture = () => {
      const glowCanvas = document.createElement('canvas');
      glowCanvas.width = 64;
      glowCanvas.height = 64;
      const context = glowCanvas.getContext('2d');
      const gradient = context.createRadialGradient(32, 32, 1, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255,255,255,.95)');
      gradient.addColorStop(.18, 'rgba(255,255,255,.65)');
      gradient.addColorStop(.55, 'rgba(255,255,255,.16)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(glowCanvas);
    };
    const glowTexture = createGlowTexture();
    const neutralGlow = new THREE.SpriteMaterial({map: glowTexture, color: 0xd3d1ca, transparent: true, opacity: .68, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false});
    const accentGlow = new THREE.SpriteMaterial({map: glowTexture, color: 0xc1272d, transparent: true, opacity: .72, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false});
    const addVertexMarkers = (size, position, rotation, material, spriteSize) => {
      [-1, 1].forEach(x => [-1, 1].forEach(y => {
        const local = new THREE.Vector3(x * size / 2, y * size / 2, 0).applyEuler(rotation).add(position);
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(local);
        sprite.scale.set(spriteSize, spriteSize, 1);
        sprite.renderOrder = 3;
        assembly.add(sprite);
      }));
    };
    const addCubeVertexMarkers = () => {
      const half = .73;
      [-1, 1].forEach(x => [-1, 1].forEach(y => [-1, 1].forEach(z => {
        const sprite = new THREE.Sprite(neutralGlow);
        sprite.position.set(x * half, y * half, z * half);
        sprite.scale.set(.105, .105, 1);
        sprite.renderOrder = 3;
        assembly.add(sprite);
      })));
    };
    addCubeVertexMarkers();
    addVertexMarkers(1.08, new THREE.Vector3(.08, .06, .86), new THREE.Euler(0, 0, 0), neutralGlow, .075);
    addVertexMarkers(1.08, new THREE.Vector3(.9, .1, .08), new THREE.Euler(0, Math.PI / 2, 0), accentGlow, .08);
    addVertexMarkers(1.08, new THREE.Vector3(.1, .9, -.08), new THREE.Euler(-Math.PI / 2, 0, 0), neutralGlow, .075);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;
    const staticMode = reducedMotion || isSmallScreen;
    let visible = true;
    let frame = 0;
    let lastTime = performance.now();
    const introDuration = 1900;
    let introStarted = staticMode;
    let introComplete = staticMode;
    let introStartTime = 0;
    let rotationY = -.42;
    let rotationX = .34;
    let pointerX = 0;
    let pointerY = 0;

    const setDrawProgress = progress => {
      wireframes.forEach(({geometry, total, delay}) => {
        const localProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
        const segmentCount = Math.floor((total * localProgress) / 2) * 2;
        geometry.setDrawRange(0, segmentCount);
      });
    };
    setDrawProgress(staticMode ? 1 : 0);

    const render = () => {
      assembly.rotation.y = rotationY + pointerX * .065;
      assembly.rotation.x = rotationX + pointerY * .05;
      renderer.render(scene, camera);
    };
    const resize = () => {
      const width = Math.max(1, container.clientWidth || 440);
      const height = Math.max(1, container.clientHeight || 550);
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    const startIntro = () => {
      if (staticMode || introStarted) return;
      introStarted = true;
      introStartTime = performance.now();
      setDrawProgress(0);
    };
    const animate = now => {
      frame = 0;
      if (!visible || staticMode) return;
      const delta = Math.min((now - lastTime) / 1000, .08);
      lastTime = now;
      if (!introComplete) {
        const introProgress = Math.min(1, (now - introStartTime) / introDuration);
        const easedProgress = 1 - Math.pow(1 - introProgress, 3);
        setDrawProgress(easedProgress);
        if (introProgress >= 1) introComplete = true;
      } else {
        rotationY += delta * (Math.PI * 2 / 78);
        rotationX += delta * (Math.PI * 2 / 88);
      }
      render();
      frame = window.requestAnimationFrame(animate);
    };
    const start = () => {
      if (!staticMode && visible && !frame) {
        lastTime = performance.now();
        frame = window.requestAnimationFrame(animate);
      }
    };
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    if (!staticMode) {
      container.addEventListener('pointermove', event => {
        const bounds = container.getBoundingClientRect();
        pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
        pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
      }, {passive: true});
      container.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; }, {passive: true});
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) {
          startIntro();
          start();
        }
        else stop();
      }, {threshold: 0}).observe(container);
    }
    window.addEventListener('resize', resize, {passive: true});
    container.classList.add('is-ready');
    resize();
    if (!staticMode) {
      startIntro();
      start();
    }
  } catch {
    showFallback();
  }
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
  initHeroCube();
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPortfolio, {once: true});
else initPortfolio();
