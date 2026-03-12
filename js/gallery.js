(function() {
  'use strict';

  var PHOTO_DIR = './assets/images/照片/';

  function renderGallery() {
    var gallery = document.getElementById('photo-gallery');
    var emptyEl = document.getElementById('gallery-empty');

    if (!gallery) return;

    if (typeof PHOTOS === 'undefined' || !PHOTOS || PHOTOS.length === 0) {
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    PHOTOS.forEach(function(filename) {
      var src = PHOTO_DIR + filename;
      var item = document.createElement('article');
      item.className = 'gallery-item';
      item.innerHTML = '<a href="' + src + '" class="gallery-link" data-src="' + src + '"><img src="' + src + '" alt="" class="gallery-img" loading="lazy"></a><p class="gallery-caption">AI生成创作</p>';
      gallery.appendChild(item);
    });

    gallery.addEventListener('click', function(e) {
      var link = e.target.closest('.gallery-link');
      if (link) {
        e.preventDefault();
        openOverlay(link.getAttribute('data-src'));
      }
    });
  }

  function openOverlay(src) {
    var overlay = document.getElementById('photo-overlay');
    var overlayImg = document.getElementById('photo-overlay-img');
    if (!overlay || !overlayImg) return;
    overlayImg.src = src;
    overlay.setAttribute('aria-hidden', 'false');
    overlay.onclick = function() {
      overlay.setAttribute('aria-hidden', 'true');
      overlayImg.src = '';
      overlay.onclick = null;
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGallery);
  } else {
    renderGallery();
  }
})();
