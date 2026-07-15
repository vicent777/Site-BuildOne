/* ============================================================
   BUILD ONE (B1) — script.js
   Header on scroll, menu mobile, reveal on scroll,
   abas de catálogo, formulário client-side (LGPD) e modal.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- menu mobile ---------- */
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ============================================================
     ABAS DO CATÁLOGO (cards ACADEMIA / ARTES MARCIAIS / BONÉS)
     ============================================================ */
  const pieceCards = document.querySelectorAll('.piece-card');
  const productPanels = document.querySelectorAll('.product-panel');
  const panelsWrapper = document.getElementById('productPanels');

  // Todas as abas fechadas por padrão.
  function openTab(targetId, { scrollIntoView = false } = {}) {
    pieceCards.forEach(card => {
      const isTarget = card.dataset.target === targetId;
      card.classList.toggle('active', isTarget);
      card.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });
    productPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === targetId);
    });
    if (scrollIntoView && panelsWrapper) {
      panelsWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function closeAllTabs() {
    pieceCards.forEach(card => {
      card.classList.remove('active');
      card.setAttribute('aria-selected', 'false');
    });
    productPanels.forEach(panel => panel.classList.remove('active'));
  }

  pieceCards.forEach(card => {
    card.addEventListener('click', () => {
      const alreadyActive = card.classList.contains('active');
      // Clicar no card ativo fecha a aba; clicar em outro card abre a nova
      // (e fecha qualquer outra que estivesse aberta).
      if (alreadyActive) {
        closeAllTabs();
      } else {
        openTab(card.dataset.target, { scrollIntoView: true });
      }
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Nenhuma aba aberta por padrão — o usuário decide o que ver.
  closeAllTabs();

  /* ============================================================
     FORMULÁRIO DE CONTATO — 100% client-side (LGPD)
     Nenhum dado é enviado a servidor ou armazenado em storage.
     Os dados só existem em memória durante o preenchimento e
     são usados apenas para montar a mensagem do WhatsApp.
     ============================================================ */
  const form = document.getElementById('orcamentoForm');
  const formError = document.getElementById('formError');
  const WHATSAPP_NUMBER = '5581982292300'; // +55 81 8229-2300

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formError.textContent = '';

      const nome = form.nome.value.trim();
      const contatoCliente = form.contatoCliente.value.trim();
      const tipoEvento = form.tipoEvento.value;
      const mensagem = form.mensagem.value.trim();
      const consentimento = form.consentimento.checked;

      if (!nome || !contatoCliente || !tipoEvento) {
        formError.textContent = 'Preencha nome, contato e tipo de evento para continuar.';
        return;
      }
      if (!consentimento) {
        formError.textContent = 'É necessário autorizar o contato da B1 para enviar o formulário.';
        return;
      }

      const partes = [
        `Olá, B1! Meu nome é ${nome}.`,
        `Contato: ${contatoCliente}`,
        `Tipo de evento/pedido: ${tipoEvento}`,
        mensagem ? `Detalhes: ${mensagem}` : null
      ].filter(Boolean);

      const texto = encodeURIComponent(partes.join('\n'));
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;

      // Dados usados apenas para montar o link — nada é salvo localmente.
      form.reset();
      showToast('Abrindo o WhatsApp com sua mensagem...');
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- toast simples ---------- */
  let toastTimer = null;
  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* ============================================================
     MODAL — Política de Privacidade
     ============================================================ */
  const privacyLinks = document.querySelectorAll('.privacy-link');
  const privacyModal = document.getElementById('privacyModal');
  const privacyClose = document.getElementById('privacyClose');

  function openModal() {
    privacyModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    privacyModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (privacyLinks.length && privacyModal) {
    privacyLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });
    privacyClose.addEventListener('click', closeModal);
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

});
