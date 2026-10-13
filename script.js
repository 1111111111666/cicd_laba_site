// Вайбкодинг: 0 тестов, 100% вайба.
// Этот файл написан на чистом вдохновении и слегка отредактирован.

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Тост ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2600);
  }

  /* ---------- Печатающая машинка ---------- */
  var phrases = [
    'пишу код на вайбе',
    'дебажу на интуиции',
    'коммичу на удаче',
    'деплою в пятницу вечером',
    'верю, что "оно само заработает"'
  ];

  var typeTarget = document.getElementById('typewriter');

  function typewriter() {
    if (!typeTarget) return;

    if (reduceMotion) {
      typeTarget.textContent = phrases[0];
      return;
    }

    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var phrase = phrases[phraseIndex];
      charIndex += deleting ? -1 : 1;
      typeTarget.textContent = phrase.slice(0, charIndex);

      var delay = deleting ? 35 : 65;

      if (!deleting && charIndex === phrase.length) {
        deleting = true;
        delay = 1400;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 350;
      }

      setTimeout(tick, delay);
    }

    tick();
  }

  /* ---------- Кнопка "Работает у меня" ---------- */
  var worksBtn = document.getElementById('worksBtn');
  var worksHint = document.getElementById('worksHint');

  if (worksBtn && worksHint) {
    worksBtn.addEventListener('click', function () {
      var alreadyOn = worksBtn.classList.toggle('btn--ghost');
      if (alreadyOn) {
        worksBtn.textContent = 'Работает у меня';
        worksHint.textContent = 'нажми, если код хотя бы запускается';
      } else {
        worksBtn.textContent = 'Работало у меня ✅';
        worksHint.textContent = 'и это, в общем-то, единственное, что имеет значение';
        toast('Отлично. Продакшн подождёт.');
      }
    });
  }

  /* ---------- Полоски скиллов ---------- */
  var skills = Array.prototype.slice.call(document.querySelectorAll('.skill'));

  function fillSkills() {
    skills.forEach(function (skill) {
      var level = Math.min(100, parseInt(skill.getAttribute('data-level'), 10) || 0);
      var bar = skill.querySelector('.skill__bar i');
      if (bar) bar.style.width = level + '%';
    });
  }

  /* ---------- Счётчики ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1200;
    var start = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ---------- Появление блоков при скролле ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.section'));

  revealItems.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');

        if (entry.target.id === 'skills') fillSkills();

        Array.prototype.forEach.call(
          entry.target.querySelectorAll('[data-count]'),
          function (el) {
            if (el.dataset.done) return;
            el.dataset.done = '1';
            runCounter(el);
          }
        );

        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });

    revealItems.forEach(function (el) { observer.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
    fillSkills();
    counters.forEach(runCounter);
  }

  /* ---------- Генератор отговорок ---------- */
  var excuses = [
    'Это не баг, это недокументированная возможность',
    'У меня локально всё работает',
    'Похоже на проблему окружения, а не кода',
    'Я просто добавил лог, больше ничего не менял',
    'Это фича. Мы её так и планировали',
    'Скорее всего, кэш. Попробуйте очистить кэш',
    'Интересно. А если перезапустить?',
    'Кто-то изменил файл, к которому я не притрагивался',
    'В понедельник это работало',
    'Такое поведение описано в документации. Где-то. Наверное',
    'Это побочный эффект зависимости, я тут ни при чём',
    'Нужно сначала обновить зависимости, потом станет ясно',
    'У меня был зелёный CI, дальше не моя зона ответственности',
    'Флакающий тест, у него просто настроение плохое',
    'Давайте вынесем это в отдельный тикет и забудем',
    'Промпт был хороший, модель подвела',
    'Дедлайн был вчера, поэтому качество символическое',
    'Это работает на моей машине, а на остальных — вопрос к остальным',
    'Тут важно не как, а что оно не падает',
    'Я думал, что это отрефакторил Copilot'
  ];

  var excuseBtn = document.getElementById('excuseBtn');
  var excuseText = document.getElementById('excuseText');
  var lastExcuse = 0;

  function randomExcuse() {
    var index = lastExcuse;
    while (index === lastExcuse && excuses.length > 1) {
      index = Math.floor(Math.random() * excuses.length);
    }
    lastExcuse = index;
    return excuses[index];
  }

  if (excuseBtn && excuseText) {
    excuseBtn.addEventListener('click', function () {
      excuseText.classList.remove('is-pop');
      void excuseText.offsetWidth;
      excuseText.textContent = '«' + randomExcuse() + '»';
      excuseText.classList.add('is-pop');
    });
  }

  /* ---------- Копирование e-mail ---------- */
  var copyBtn = document.getElementById('copyBtn');

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || '';
      var done = function () {
        copyBtn.textContent = 'Скопировано: ' + email;
        toast('E-mail в буфере. Пишите, я отвечу через 5 месяцев.');
        setTimeout(function () {
          copyBtn.textContent = 'Скопировать e-mail';
        }, 2600);
      };

      var failed = function () {
        toast('Скопировать не вышло. Как и прод в пятницу.');
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, failed);
      } else {
        var input = document.createElement('input');
        input.value = email;
        document.body.appendChild(input);
        input.select();
        try { document.execCommand('copy'); done(); } catch (err) { failed(); }
        document.body.removeChild(input);
      }
    });
  }

  /* ---------- Активная ссылка в меню ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));

  if ('IntersectionObserver' in window && navLinks.length) {
    var sections = navLinks
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- Бегущая строка без разрыва ---------- */
  var tickerTrack = document.querySelector('.ticker__track');

  if (tickerTrack) {
    tickerTrack.innerHTML += tickerTrack.innerHTML;
  }

  /* ---------- Год в футере ---------- */
  var yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Пасхалка ---------- */
  var konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  var konamiIndex = 0;

  document.addEventListener('keydown', function (event) {
    var key = event.key;
    if (key.length === 1) key = key.toLowerCase();

    if (key === konami[konamiIndex]) {
      konamiIndex += 1;

      if (konamiIndex === konami.length) {
        konamiIndex = 0;
        document.body.classList.toggle('overdrive');
        toast(document.body.classList.contains('overdrive')
          ? 'ВАЙБ АКТИВИРОВАН. Цвета теперь тоже импровизируют.'
          : 'Вайб отключён. Продакшн выдохнул.');
      }
    } else {
      konamiIndex = key === konami[0] ? 1 : 0;
    }
  });

  /* ---------- Поехали ---------- */
  typewriter();

  var heroSection = document.querySelector('.hero');
  if (heroSection) heroSection.classList.add('is-in');
})();