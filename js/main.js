(function () {
  'use strict';

  function setGreeting() {
    var greetingEl = document.getElementById('greeting');
    if (!greetingEl) return;

    var hour = new Date().getHours();
    var text;

    if (hour >= 5 && hour < 12) {
      text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
    } else if (hour >= 12 && hour < 14) {
      text = '中午好！记得好好吃饭，休息一下再继续～';
    } else if (hour >= 14 && hour < 18) {
      text = '下午好！保持专注，也要记得喝水哦！';
    } else if (hour >= 18 && hour < 22) {
      text = '晚上好！辛苦了一天，放松一下吧～';
    } else {
      text = '夜深了，早点休息，明天继续加油！';
    }

    greetingEl.textContent = text;
  }

  function highlightNavOnScroll() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');

    function updateActive() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;

      for (var i = sections.length - 1; i >= 0; i--) {
        var section = sections[i];
        var top = section.offsetTop - 100;
        var height = section.offsetHeight;

        if (scrollY >= top && scrollY < top + height) {
          var id = section.getAttribute('id');
          navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === '#' + id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
          return;
        }
      }
      navLinks.forEach(function (link) {
        link.classList.remove('active');
      });
    }

    window.addEventListener('scroll', updateActive);
    updateActive();
  }

  function initMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');

    if (!toggle || !links) return;

    function toggleMenu() {
      links.classList.toggle('open');
    }

    toggle.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  function setThemeColor(isDark) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isDark ? '#1a1a1c' : '#faf9f7';
  }

  function initThemeToggle() {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    var saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setThemeColor(true);
    }

    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      if (current === 'dark') {
        localStorage.setItem('theme', 'light');
        document.documentElement.removeAttribute('data-theme');
        setThemeColor(false);
      } else {
        localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        setThemeColor(true);
      }
    });
  }

  function initCopyButtons() {
    document.querySelectorAll('.btn-copy[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        if (!text) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            showCopied(btn);
          }).catch(function () {
            fallbackCopy(text, btn);
          });
        } else {
          fallbackCopy(text, btn);
        }
      });
    });
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showCopied(btn);
    } catch (e) {}
    document.body.removeChild(ta);
  }

  function showCopied(btn) {
    var originalText = btn.textContent;
    btn.classList.add('copied');
    btn.textContent = '已复制';
    setTimeout(function () {
      btn.classList.remove('copied');
      btn.textContent = originalText;
    }, 1500);
  }

  function initScrollAnimations() {
    var sections = document.querySelectorAll('.section-fade');
    if (!sections.length) return;
    if (typeof IntersectionObserver === 'undefined') {
      sections.forEach(function (s) { s.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  function init() {
    try {
      setGreeting();
      highlightNavOnScroll();
      initMobileMenu();
      initThemeToggle();
      initCopyButtons();
      initScrollAnimations();
    } catch (e) {
      console.warn('main.js init error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
