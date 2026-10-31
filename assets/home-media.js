(() => {
  // Native video controls retain keyboard support; only one clip plays at a time.
  const videos = document.querySelectorAll('.project-video video');
  videos.forEach(video => video.addEventListener('play', () => {
    videos.forEach(other => { if (other !== video) other.pause(); });
  }));
  const links = document.querySelectorAll('[data-project-photo]');
  if (!links.length || !('HTMLDialogElement' in window)) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'photo-dialog';
  dialog.setAttribute('aria-label', 'Project photo');
  const close = document.createElement('button');
  close.textContent = 'Close photo ×';
  const image = document.createElement('img');
  const caption = document.createElement('p');
  dialog.append(close, image, caption);
  document.body.append(dialog);
  let opener;
  links.forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    caption.textContent = image.alt;
    dialog.showModal();
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => opener?.focus());
})();
