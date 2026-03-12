(function() {
  'use strict';

  var FALLBACK_DELAY = 5000;
  var FALLBACK_VALUE = '-';

  var ids = ['busuanzi_site_pv', 'busuanzi_today_pv'];

  function setFallback() {
    ids.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        var val = el.textContent.trim();
        if (!val || isNaN(parseInt(val, 10))) {
          el.textContent = FALLBACK_VALUE;
        }
      }
    });
  }

  setTimeout(setFallback, FALLBACK_DELAY);
})();
