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

  // Краткое описание
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

  // Контент урока
  (lesson.content || []).forEach(block => {
    if (block.type === 'text') {
      const section = document.createElement('section');
      section.className = 'lesson-block fade-in';
      if (block.title) {
        const h3 = document.createElement('h3');
        h3.textContent = block.title;
        section.appendChild(h3);
      }
      const p = document.createElement('p');
      p.textContent = block.text;
      section.appendChild(p);
      contentEl.appendChild(section);
    }

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
    // ====== GALLERY BLOCK ======
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
// end GALLERY BLOCK



    if (block.type === 'code') {
      const section = document.createElement('section');
      section.className = 'lesson-block';
      if (block.title) {
        const h3 = document.createElement('h3');
        h3.textContent = block.title;
        section.appendChild(h3);
      }
      const pre = document.createElement('pre');
      pre.textContent = block.text;
      section.appendChild(pre);
      contentEl.appendChild(section);
    }
  });

  // Тест
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

// функция увеличения картинки
function openImageFullscreen(src) {
  const overlay = document.createElement("div");
  overlay.className = "image-overlay";

  const img = document.createElement("img");
  img.src = src;
  img.className = "fullscreen-image";

  overlay.appendChild(img);
  document.body.appendChild(overlay);

  // закрытие по клику
  overlay.onclick = () => overlay.remove();
}

