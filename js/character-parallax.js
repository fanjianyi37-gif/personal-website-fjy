(function() {
  'use strict';

  var CONFIG = {
    sensitivity: 0.15,
    maxRotate: 8,
    lerpSpeed: 0.07
  };

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function init() {
    if (prefersReducedMotion()) return;

    var el = document.getElementById('character-img');
    var container = document.getElementById('character-parallax');

    if (!el || !container) return;

    var targetX = 0;
    var targetY = 0;
    var currentX = 0;
    var currentY = 0;

    function onMouseMove(e) {
      var rect = container.getBoundingClientRect();
      var headX = rect.left + rect.width * 0.5;
      var headY = rect.top + rect.height * 0.3;
      var dx = e.clientX - headX;
      var dy = e.clientY - headY;
      targetY = (dx / window.innerWidth) * CONFIG.maxRotate * 6 * CONFIG.sensitivity;
      targetX = -(dy / window.innerHeight) * CONFIG.maxRotate * 6 * CONFIG.sensitivity;
    }

    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
    }

    function animate() {
      currentX = lerp(currentX, targetX, CONFIG.lerpSpeed);
      currentY = lerp(currentY, targetY, CONFIG.lerpSpeed);
      el.style.transform = 'rotateX(' + currentX + 'deg) rotateY(' + currentY + 'deg)';
      requestAnimationFrame(animate);
    }

    document.addEventListener('mouseleave', onMouseLeave);

    window.addEventListener('mousemove', onMouseMove);
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
