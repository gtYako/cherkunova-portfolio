const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');

menuButton?.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

document.querySelectorAll('[data-scroll]').forEach(button => {
  button.addEventListener('click', () => {
    const rail = document.getElementById(button.dataset.scroll);
    const direction = Number(button.dataset.direction || 1);
    rail?.scrollBy({ left: direction * Math.min(rail.clientWidth * 0.82, 620), behavior: 'smooth' });
  });
});

const dialog = document.querySelector('.lightbox');
const dialogImage = dialog?.querySelector('img');
const dialogText = dialog?.querySelector('p');

const closeDialog = () => {
  if (!dialog?.open || dialog.classList.contains('is-closing')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dialog.close();
    return;
  }

  dialog.classList.add('is-closing');
  const finishClose = () => {
    dialog.removeEventListener('animationend', finishClose);
    if (dialog.open) dialog.close();
    dialog.classList.remove('is-closing');
  };
  dialog.addEventListener('animationend', finishClose, { once: true });
  window.setTimeout(finishClose, 280);
};

document.querySelectorAll('[data-full]').forEach(documentButton => {
  documentButton.addEventListener('click', () => {
    const preview = documentButton.querySelector('img');
    const caption = documentButton.querySelector('span')?.textContent.trim()
      || documentButton.closest('article')?.querySelector('h3')?.textContent.trim()
      || preview.alt;
    dialogImage.src = documentButton.dataset.full;
    dialogImage.alt = preview.alt;
    dialogText.textContent = caption;
    dialog.classList.remove('is-closing');
    dialog.showModal();
  });
});

dialog?.querySelector('.lightbox-close')?.addEventListener('click', closeDialog);
dialog?.addEventListener('click', event => {
  if (event.target === dialog) closeDialog();
});
