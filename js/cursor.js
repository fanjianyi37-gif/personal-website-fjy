/**
 * 自定义跟随光标：圆形光标 + 拖尾 + 粒子 + 点击波纹
 * 拖尾长度修改位置：TRAIL_COUNT（5-8）、TRAIL_LERP（越小拖尾越长）
 * 粒子数量调整处：PARTICLE_COUNT（3-5）
 * 光标颜色调整参数：见 setColor 中的 #FF69B4、#FFE4E1
 */
(function () {
  'use strict';

  if (window.innerWidth < 768) return;

  // 拖尾长度修改位置：5-8 个小圆点
  var TRAIL_COUNT = 6;
  var TRAIL_LERP = 0.35; // 越小拖尾越长，≤20px 视觉长度
  var PARTICLE_COUNT = 4; // 粒子数量调整处：3-5
  var CURSOR_LERP = 0.28; // 主光标缓动，ease-out 感

  var mx = 0, my = 0;
  var tx = 0, ty = 0;
  var trailPos = [];
  var lastSpawn = 0;
  var currentColor = '#FFE4E1';

  var container = document.createElement('div');
  container.className = 'cursor-container';
  container.innerHTML = '<div class="cursor-dot" id="cursor-dot"></div>';
  document.body.appendChild(container);

  var dot = document.getElementById('cursor-dot');
  var trailContainer = document.createElement('div');
  trailContainer.className = 'cursor-trail';
  container.appendChild(trailContainer);

  for (var i = 0; i < TRAIL_COUNT; i++) {
    var t = document.createElement('div');
    t.className = 'cursor-trail-dot';
    var size = 2 + (2 * (1 - i / TRAIL_COUNT)); // 2-4px
    t.style.width = size + 'px';
    t.style.height = size + 'px';
    t.style.background = 'rgba(255, 182, 193, 0.8)';
    trailContainer.appendChild(t);
    trailPos.push({ x: 0, y: 0 });
  }

  var trailDots = trailContainer.querySelectorAll('.cursor-trail-dot');

  /** 检测光标位置背景亮度，用于颜色自适应 */
  function getBgLuminance(x, y) {
    var el;
    if (document.elementsFromPoint) {
      var list = document.elementsFromPoint(x, y);
      for (var i = 0; i < list.length; i++) {
        if (!container.contains(list[i])) {
          el = list[i];
          break;
        }
      }
    }
    if (!el) el = document.elementFromPoint(x, y);
    if (!el || container.contains(el)) return 0.95;
    var bg = window.getComputedStyle(el).backgroundColor;
    var m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (m) {
      var r = parseInt(m[1], 10) / 255;
      var g = parseInt(m[2], 10) / 255;
      var b = parseInt(m[3], 10) / 255;
      return 0.299 * r + 0.587 * g + 0.114 * b;
    }
    m = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
    if (m) {
      var r2 = parseInt(m[1], 10) / 255;
      var g2 = parseInt(m[2], 10) / 255;
      var b2 = parseInt(m[3], 10) / 255;
      return 0.299 * r2 + 0.587 * g2 + 0.114 * b2;
    }
    return 0.95;
  }

  /** 光标颜色调整参数：浅色背景用 #FF69B4，深色用 #FFE4E1 */
  function setColor(lum) {
    currentColor = lum > 0.8 ? '#FF69B4' : '#FFE4E1';
    dot.style.background = currentColor;
    dot.style.boxShadow = '0 0 4px ' + currentColor + '80';
    for (var i = 0; i < trailDots.length; i++) {
      trailDots[i].style.background = currentColor;
    }
    return currentColor;
  }

  /** 粒子：浅粉/淡蓝，0.8 秒渐变消失 */
  function spawnParticle(px, py, color) {
    var p = document.createElement('div');
    p.className = 'cursor-particle';
    var s = 2 + Math.random() * 2;
    p.style.width = s + 'px';
    p.style.height = s + 'px';
    p.style.left = px + 'px';
    p.style.top = py + 'px';
    p.style.background = color || '#FFC0CB';
    p.style.marginLeft = '-' + (s / 2) + 'px';
    p.style.marginTop = '-' + (s / 2) + 'px';
    p.style.opacity = '0.8';
    p.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    container.appendChild(p);
    setTimeout(function () {
      p.style.opacity = '0';
      var dx = (Math.random() - 0.5) * 12;
      var dy = (Math.random() - 0.5) * 12;
      p.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      setTimeout(function () { p.remove(); }, 850);
    }, 10);
  }

  /** 点击波纹：直径 20px，0.5 秒消失 */
  function showRipple(x, y) {
    var r = document.createElement('div');
    r.className = 'cursor-ripple';
    r.style.left = x + 'px';
    r.style.top = y + 'px';
    r.style.width = '20px';
    r.style.height = '20px';
    r.style.marginLeft = '-10px';
    r.style.marginTop = '-10px';
    r.style.borderColor = currentColor + '99';
    container.appendChild(r);
    setTimeout(function () { r.remove(); }, 500);
  }

  var hasMoved = false;
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    if (!hasMoved) {
      hasMoved = true;
      tx = mx; ty = my;
      for (var k = 0; k < trailPos.length; k++) {
        trailPos[k].x = mx;
        trailPos[k].y = my;
      }
    }
    if (Date.now() - lastSpawn > 100) {
      lastSpawn = Date.now();
      var lum = getBgLuminance(mx, my);
      var col = setColor(lum);
      var colors = ['#FFC0CB', '#E0F7FA'];
      for (var j = 0; j < PARTICLE_COUNT; j++) {
        var pc = Math.random() > 0.5 ? col : colors[j % 2];
        spawnParticle(mx + (Math.random() - 0.5) * 16, my + (Math.random() - 0.5) * 16, pc);
      }
    }
  });

  document.addEventListener('click', function (e) {
    showRipple(e.clientX, e.clientY);
  });

  document.body.classList.add('custom-cursor-active');

  function animate() {
    tx += (mx - tx) * CURSOR_LERP;
    ty += (my - ty) * CURSOR_LERP;

    dot.style.left = tx + 'px';
    dot.style.top = ty + 'px';

    var lum = getBgLuminance(Math.round(tx), Math.round(ty));
    setColor(lum);

    // 拖尾：每个点跟随前一个，透明度从 0.8 渐变到 0
    for (var i = 0; i < trailDots.length; i++) {
      var targetX = i === 0 ? tx : trailPos[i - 1].x;
      var targetY = i === 0 ? ty : trailPos[i - 1].y;
      trailPos[i].x += (targetX - trailPos[i].x) * TRAIL_LERP;
      trailPos[i].y += (targetY - trailPos[i].y) * TRAIL_LERP;
      trailDots[i].style.left = trailPos[i].x + 'px';
      trailDots[i].style.top = trailPos[i].y + 'px';
      trailDots[i].style.opacity = (1 - (i + 1) / (TRAIL_COUNT + 1)) * 0.8;
    }

    requestAnimationFrame(animate);
  }
  animate();
})();
