(() => {
  'use strict';

  // Informe o telefone da MARQUI, com país e DDD, somente com números.
  // Sem um número configurado, o link abre o WhatsApp para escolher o contato.
  const WHATSAPP_NUMBER = '551194830571';
  const whatsappLinks = document.querySelectorAll('[data-whatsapp]');
  const localWhatsApp = 'https://wa.me/';

  whatsappLinks.forEach((link) => {
    const message = link.dataset.message || 'Olá! Quero conversar com a MARQUI.';
    const phone = WHATSAPP_NUMBER.replace(/\D/g, '');
    link.href = `${localWhatsApp}${phone ? `${phone}/` : ''}?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  let menuOpener = null;

  function closeMenu(restoreFocus = true) {
    if (!document.body.classList.contains('menu-open')) return;
    document.body.classList.remove('menu-open', 'nav-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    if (restoreFocus && menuOpener) menuOpener.focus({ preventScroll: true });
    menuOpener = null;
  }

  function openMenu() {
    menuOpener = document.activeElement;
    document.body.classList.add('menu-open', 'nav-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Fechar menu');
    navigation.querySelector('a')?.focus({ preventScroll: true });
  }

  menuButton.addEventListener('click', () => {
    if (document.body.classList.contains('menu-open')) closeMenu();
    else openMenu();
  });

  document.addEventListener('click', (event) => {
    if (!document.body.classList.contains('menu-open')) return;
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectCards = [...document.querySelectorAll('.project-card')];
  const filterStatus = document.querySelector('.filter-status');
  const filterNames = {
    todos: 'Todos os projetos conceituais',
    cafe: 'Projetos conceituais de cafeterias',
    alimentacao: 'Projetos conceituais de restaurantes',
    saude: 'Projetos conceituais de saúde',
    comercio: 'Projetos conceituais de comércio',
    servicos: 'Projetos conceituais de serviços',
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      let visibleCount = 0;
      projectCards.forEach((card) => {
        const show = filter === 'todos' || card.dataset.category === filter;
        card.hidden = !show;
        if (show) visibleCount += 1;
      });
      filterStatus.textContent = `${filterNames[filter]} · ${visibleCount} ${visibleCount === 1 ? 'exemplo' : 'exemplos'}`;
    });
  });

  const projectDialog = document.querySelector('.project-dialog');
  const dialogClose = document.querySelector('.dialog-close');
  const dialogTitle = document.querySelector('#dialog-title');
  const dialogDescription = document.querySelector('.dialog-description');
  const dialogImage = document.querySelector('.dialog-image');
  let cardOpener = null;

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      cardOpener = card;
      dialogTitle.textContent = card.dataset.title;
      dialogDescription.textContent = card.dataset.description;
      dialogImage.className = `dialog-image photo ${card.dataset.photo}`;
      dialogImage.setAttribute('aria-label', `Imagem conceitual: ${card.dataset.title}`);
      projectDialog.showModal();
      dialogClose.focus({ preventScroll: true });
    });
  });

  function closeProjectDialog() {
    if (!projectDialog.open) return;
    projectDialog.close();
    cardOpener?.focus({ preventScroll: true });
    cardOpener = null;
  }

  dialogClose.addEventListener('click', closeProjectDialog);
  projectDialog.addEventListener('click', (event) => {
    if (event.target === projectDialog) closeProjectDialog();
  });
  projectDialog.addEventListener('close', () => {
    if (cardOpener) cardOpener.focus({ preventScroll: true });
    cardOpener = null;
  });

  document.querySelectorAll('.faq-item').forEach((item) => {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    const initiallyOpen = button.getAttribute('aria-expanded') === 'true';

    answer.hidden = false;
    answer.inert = !initiallyOpen;
    answer.setAttribute('aria-hidden', String(!initiallyOpen));
    answer.classList.toggle('is-collapsed', !initiallyOpen);
    answer.style.maxHeight = initiallyOpen ? 'none' : '0px';

    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('is-open', !open);
      icon.textContent = open ? '+' : '−';

      if (open) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        answer.inert = true;
        answer.setAttribute('aria-hidden', 'true');
        requestAnimationFrame(() => {
          answer.classList.add('is-collapsed');
          answer.style.maxHeight = '0px';
        });
      } else {
        answer.inert = false;
        answer.setAttribute('aria-hidden', 'false');
        answer.classList.remove('is-collapsed');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        answer.addEventListener('transitionend', function expandFully(event) {
          if (event.propertyName !== 'max-height') return;
          answer.style.maxHeight = 'none';
          answer.removeEventListener('transitionend', expandFully);
        });
      }
    });
  });

  const toast = document.querySelector('.toast');
  let toastTimer;
  document.querySelectorAll('[data-local-notice]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      toast.textContent = 'As informações legais serão disponibilizadas quando o site da MARQUI for publicado.';
      toast.hidden = false;
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => { toast.hidden = true; }, 4200);
    });
  });

  document.querySelector('#year').textContent = new Date().getFullYear();

  const activeLinks = new Map([...document.querySelectorAll('[data-nav-target]')].map((link) => [link.dataset.navTarget, link]));
  if ('IntersectionObserver' in window) {
    const sections = [...activeLinks.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    const navigationObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      activeLinks.forEach((link) => link.removeAttribute('aria-current'));
      activeLinks.get(visible.target.id)?.setAttribute('aria-current', 'location');
    }, { rootMargin: '-24% 0px -62% 0px', threshold: [0, .15, .35, .6] });
    sections.forEach((section) => navigationObserver.observe(section));
  }

  const floatingContact = document.querySelector('.floating-whatsapp');
  let pendingScrollFrame = false;
  function updateFloatingContact() {
    pendingScrollFrame = false;
    const footerTop = document.querySelector('.site-footer').getBoundingClientRect().top;
    const pastHero = window.scrollY > Math.min(560, window.innerHeight * .7);
    floatingContact.hidden = !pastHero || footerTop < window.innerHeight * .85 || document.body.classList.contains('menu-open');
  }
  window.addEventListener('scroll', () => {
    if (pendingScrollFrame) return;
    pendingScrollFrame = true;
    requestAnimationFrame(updateFloatingContact);
  }, { passive: true });
  window.addEventListener('resize', updateFloatingContact, { passive: true });
  updateFloatingContact();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -35px 0px' });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
  });
})();
