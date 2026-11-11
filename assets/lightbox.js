/* Shared, dependency-free image viewer. The active list follows the current filters. */
window.createImageViewer = function createImageViewer() {
  const modal = document.createElement('dialog');
  modal.className = 'image-viewer';
  modal.setAttribute('aria-label', 'Trình xem ảnh');
  modal.innerHTML = `<div class="viewer-toolbar"><span class="viewer-count" aria-live="polite"></span><div>
    <button type="button" data-action="play" aria-label="Phát trình chiếu" title="Trình chiếu">▷</button>
    <button type="button" data-action="zoom" aria-label="Phóng to ảnh" aria-pressed="false" title="Phóng to">＋</button>
    <button type="button" data-action="fullscreen" aria-label="Toàn màn hình" title="Toàn màn hình">⛶</button>
    <button type="button" data-action="thumbs" aria-label="Hiện ảnh thu nhỏ" aria-pressed="false" title="Ảnh thu nhỏ">▦</button>
    <button type="button" data-action="share" aria-label="Sao chép liên kết ảnh" title="Chia sẻ">↗</button>
    <a class="viewer-download" download aria-label="Tải ảnh" title="Tải ảnh">↓</a>
    <button type="button" data-action="close" aria-label="Đóng trình xem ảnh" title="Đóng (Esc)">×</button></div></div>
    <div class="viewer-stage"><button type="button" class="viewer-prev" aria-label="Ảnh trước">‹</button>
    <div class="viewer-image-wrap"><img class="viewer-image" alt=""></div>
    <button type="button" class="viewer-next" aria-label="Ảnh tiếp theo">›</button></div>
    <div class="viewer-caption"></div><div class="viewer-thumbs" hidden></div><p class="viewer-status" role="status"></p>`;
  document.body.append(modal);
  const $ = selector => modal.querySelector(selector);
  let items = [], index = 0, timer = null, opener = null, startX = null;
  function stop() {
    clearInterval(timer); timer = null;
    $('[data-action="play"]').textContent = '▷';
    $('[data-action="play"]').setAttribute('aria-label', 'Phát trình chiếu');
  }
  function show(next) {
    index = Math.max(0, Math.min(items.length - 1, next));
    const item = items[index];
    $('.viewer-image').src = item.src;
    $('.viewer-image').alt = item.alt;
    $('.viewer-count').textContent = `${index + 1} / ${items.length}`;
    $('.viewer-caption').textContent = `${item.subject} · ${item.colorLabel} · ${item.orientationLabel} · ${item.width} × ${item.height} px`;
    $('.viewer-download').href = item.src;
    $('.viewer-download').download = item.filename;
    $('.viewer-prev').disabled = index === 0;
    $('.viewer-next').disabled = index === items.length - 1;
    $('.viewer-image-wrap').classList.remove('is-zoomed');
    $('[data-action="zoom"]').setAttribute('aria-pressed', 'false');
    $('.viewer-status').textContent = '';
    [...$('.viewer-thumbs').children].forEach((node, i) => node.setAttribute('aria-current', String(i === index)));
    if (index === items.length - 1) stop();
  }
  function close() { modal.close(); }
  modal.addEventListener('close', () => {
    stop(); document.body.style.overflow = '';
    if (document.fullscreenElement === modal) document.exitFullscreen().catch(() => {});
    opener?.focus();
  });
  $('.viewer-prev').addEventListener('click', () => { stop(); show(index - 1); });
  $('.viewer-next').addEventListener('click', () => { stop(); show(index + 1); });
  modal.addEventListener('click', async event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'close' || event.target === modal) close();
    if (action === 'zoom') {
      const zoomed = $('.viewer-image-wrap').classList.toggle('is-zoomed');
      $('[data-action="zoom"]').setAttribute('aria-pressed', String(zoomed));
    }
    if (action === 'thumbs') {
      $('.viewer-thumbs').hidden = !$('.viewer-thumbs').hidden;
      $('[data-action="thumbs"]').setAttribute('aria-pressed', String(!$('.viewer-thumbs').hidden));
    }
    if (action === 'play') {
      if (timer) return stop();
      if (index === items.length - 1) show(0);
      timer = setInterval(() => show(index + 1), 3500);
      $('[data-action="play"]').textContent = 'Ⅱ';
      $('[data-action="play"]').setAttribute('aria-label', 'Dừng trình chiếu');
    }
    if (action === 'fullscreen') {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await modal.requestFullscreen();
      } catch { $('.viewer-status').textContent = 'Trình duyệt hiện tại không hỗ trợ toàn màn hình.'; }
    }
    if (action === 'share') {
      const url = new URL(location.href); url.hash = `photo=${items[index].id}`;
      try { await navigator.clipboard.writeText(url.href); $('.viewer-status').textContent = 'Đã sao chép liên kết ảnh.'; }
      catch { $('.viewer-status').textContent = url.href; }
    }
  });
  modal.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); stop(); show(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); stop(); show(index - 1); }
    if (event.key === 'Home') { event.preventDefault(); stop(); show(0); }
    if (event.key === 'End') { event.preventDefault(); stop(); show(items.length - 1); }
  });
  $('.viewer-image-wrap').addEventListener('pointerdown', event => { startX = event.clientX; });
  $('.viewer-image-wrap').addEventListener('pointerup', event => {
    if (startX !== null && !$('.viewer-image-wrap').classList.contains('is-zoomed') && Math.abs(event.clientX - startX) > 60) {
      stop(); show(index + (event.clientX < startX ? 1 : -1));
    }
    startX = null;
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  return {
    open(list, selected = 0, trigger = document.activeElement) {
      items = list; if (!items.length) return;
      opener = trigger;
      $('.viewer-thumbs').replaceChildren(...items.map((item, i) => {
        const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-label', `Xem ảnh ${i + 1}: ${item.subject}`);
        const img = document.createElement('img'); img.src = item.thumbnail || item.src; img.alt = ''; img.loading = 'lazy';
        button.append(img); button.addEventListener('click', () => { stop(); show(i); }); return button;
      }));
      show(selected); modal.showModal(); document.body.style.overflow = 'hidden';
      $('[data-action="close"]').focus();
    }
  };
};
