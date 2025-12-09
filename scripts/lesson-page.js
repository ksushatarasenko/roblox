// ===============================
// ГЛАВНАЯ АСИНХРОННАЯ ФУНКЦИЯ
// ===============================
(async function () {

  const { getQueryParam } = window.appRouter;
  const lessonId = getQueryParam('lessonId');

  const titleEl = document.getElementById('lesson-title');
  const metaEl = document.getElementById('lesson-meta');
  const videoEl = document.getElementById('video-block');
  const contentEl = document.getElementById('lesson-content');
  const quizEl = document.getElementById('quiz-block');

  if (!lessonId) {
    titleEl.textContent = 'Урок не найден';
    return;
  }

  const data = await window.courseApi.loadCourseData();
  const found = window.courseApi.findLessonById(data, lessonId);

  if (!found) {
    titleEl.textContent = 'Урок не найден';
    return;
  }

  const { module, lesson } = found;

  // Заголовок
  titleEl.textContent = lesson.title;

  // Метаданные
  metaEl.innerHTML = `
    <p><strong>Модуль:</strong> ${module.title}</p>
    ${lesson.shortDescription ? `<p>${lesson.shortDescription}</p>` : ''}
  `;

  // Видео
  if (lesson.video) {
    const iframe = document.createElement('iframe');
    iframe.src = lesson.video;
    iframe.width = '640';
    iframe.height = '360';
    iframe.allowFullscreen = true;
    iframe.title = 'Видео урока';
    videoEl.appendChild(iframe);
  }

  // Контент
  (lesson.content || []).forEach(block => {

    // TEXT
    if (block.type === 'text') {
      const section = document.createElement('section');
      section.className = 'lesson-block fade-in';

      if (block.title) {
        const h3 = document.createElement('h3');
        h3.textContent = block.title;
        section.appendChild(h3);
      }

      const texts = Array.isArray(block.text) ? block.text : [block.text];

      texts.forEach(t => {
        const p = document.createElement('p');
        p.innerHTML = t;
        section.appendChild(p);
      });

      contentEl.appendChild(section);
    }

    // STEPS
    if (block.type === 'steps') {
      const section = document.createElement('section');
      section.className = 'lesson-block';

      if (block.title) {
        const h3 = document.createElement('h3');
        h3.textContent = block.title;
        section.appendChild(h3);
      }

      const ol = document.createElement('ol');
      (block.items || []).forEach(stepText => {
        const li = document.createElement('li');
        li.textContent = stepText;
        ol.appendChild(li);
      });

      section.appendChild(ol);
      contentEl.appendChild(section);
    }

    // GALLERY
    if (block.type === "gallery") {
      const section = document.createElement("section");
      section.className = "lesson-block fade-in";

      if (block.title) {
        const h3 = document.createElement("h3");
        h3.textContent = block.title;
        section.appendChild(h3);
      }

      const gallery = document.createElement("div");
      gallery.className = "image-gallery";

      block.images.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "thumb";
        img.onclick = () => openImageFullscreen(src);
        gallery.appendChild(img);
      });

      section.appendChild(gallery);
      contentEl.appendChild(section);
    }

    // CODE
    if (block.type === 'code') {
      const section = document.createElement('section');
      section.className = 'lesson-block';

      if (block.title) {
        const h3 = document.createElement('h3');
        h3.textContent = block.title;
        section.appendChild(h3);
      }
      // Пояснение под заголовком
      if (block.text) {
        const p = document.createElement('p');
        p.className = "code-description";
        p.innerHTML = block.text; // поддерживает HTML
        section.appendChild(p);
      }
      // Сам код
      const pre = document.createElement('pre');
      const code = document.createElement('code');

      code.className = `language-${block.language || 'lua'}`;
      code.textContent = block.code || '';

      pre.appendChild(code);
      section.appendChild(pre);
      contentEl.appendChild(section);

      requestAnimationFrame(() => {
        hljs.highlightElement(code);
      });
    }

    // NOTE
    if (block.type === 'note') {
      const div = document.createElement('div');
      div.className = 'note-block';
      div.innerHTML = block.text;
      contentEl.appendChild(div);
    }

    // WARNING
    if (block.type === 'warning') {
      const div = document.createElement('div');
      div.className = 'warning-block';
      div.innerHTML = block.text;
      contentEl.appendChild(div);
    }

  });

  // QUIZ
  if (lesson.quiz && lesson.quiz.length > 0) {

    const title = document.createElement('h2');
    title.textContent = 'Проверь себя';
    quizEl.appendChild(title);

    lesson.quiz.forEach((q, qIndex) => {
      const block = document.createElement('div');
      block.className = 'quiz-question fade-in';

      const p = document.createElement('p');
      p.textContent = q.question;
      block.appendChild(p);

      q.answers.forEach((answer, aIndex) => {
        const label = document.createElement('label');
        const input = document.createElement('input');

        input.type = 'radio';
        input.name = `q${qIndex}`;
        input.value = aIndex;

        label.appendChild(input);
        label.append(` ${answer}`);
        block.appendChild(label);
      });

      quizEl.appendChild(block);
    });

    const btn = document.createElement('button');
    btn.textContent = 'Проверить ответы';

    btn.onclick = () => {
      let correctCount = 0;

      lesson.quiz.forEach((q, qIndex) => {
        const chosen = document.querySelector(`input[name="q${qIndex}"]:checked`);
        if (!chosen) return;
        if (Number(chosen.value) === q.correct) correctCount++;
      });

      alert(`Правильных ответов: ${correctCount} из ${lesson.quiz.length}`);
    };

    quizEl.appendChild(btn);
  }

})();





// ===============================
// ФУНКЦИЯ ДЛЯ УВЕЛИЧЕНИЯ ИЗОБРАЖЕНИЙ
// ===============================
function openImageFullscreen(src) {

  // Создаём затемнённый фон
  const overlay = document.createElement("div");
  overlay.className = "image-overlay";

  // Само изображение в центре
  const img = document.createElement("img");
  img.src = src;
  img.className = "fullscreen-image";

  overlay.appendChild(img);
  document.body.appendChild(overlay);

  // закрытие по клику
  overlay.onclick = () => overlay.remove();
}


// "note" — голубой информативный блок

// "warning" — жёлтый блок-предупреждение