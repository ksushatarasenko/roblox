// ===============================
// ГЛАВНАЯ АСИНХРОННАЯ ФУНКЦИЯ
// ===============================
(async function () {
  const { getQueryParam } = window.appRouter;
  const lessonId = getQueryParam("lessonId");

  const titleEl = document.getElementById("lesson-title");
  const metaEl = document.getElementById("lesson-meta");
  const videoEl = document.getElementById("video-block");
  const contentEl = document.getElementById("lesson-content");
  const quizEl = document.getElementById("quiz-block");

  if (!lessonId) {
    titleEl.textContent = "Урок не найден";
    return;
  }

  const data = await window.courseApi.loadCourseData();
  const found = window.courseApi.findLessonById(data, lessonId);

  if (!found) {
    titleEl.textContent = "Урок не найден";
    return;
  }

  const { module, lesson } = found;

  // Заголовок
  titleEl.textContent = lesson.title;

  // Метаданные
  metaEl.innerHTML = `
    <p><strong>Модуль:</strong> ${module.title}</p>
    ${lesson.shortDescription ? `<p>${lesson.shortDescription}</p>` : ""}
  `;

  // Видео
  if (lesson.video) {
    const iframe = document.createElement("iframe");
    iframe.src = lesson.video;
    iframe.width = "640";
    iframe.height = "360";
    iframe.allowFullscreen = true;
    iframe.title = "Видео урока";
    videoEl.appendChild(iframe);
  }

  // Контент
  (lesson.content || []).forEach((block) => {
    // text
    if (block.type === "text") {
      const section = document.createElement("section");
      section.className = "lesson-block fade-in";

      if (block.title) {
        // Если заголовок — массив
        if (Array.isArray(block.title)) {
          block.title.forEach((t) => {
            const h3 = document.createElement("h3");
            h3.textContent = t;
            section.appendChild(h3);
          });
        }
        // Если заголовок — обычная строка
        else {
          const h3 = document.createElement("h3");
          h3.textContent = block.title;
          section.appendChild(h3);
        }
      }

      if (block.textH4) {
        if (Array.isArray(block.textH4)) {
          block.textH4.forEach((t) => {
            const h4 = document.createElement("h4");
            h4.textContent = t;
            section.appendChild(h4);
          });
        }
        // Если заголовок — обычная строка
        else {
          const h4 = document.createElement("h4");
          h4.textContent = block.textH4;
          section.appendChild(h4);
        }
      }

      const texts = Array.isArray(block.text) ? block.text : [block.text];

      texts.forEach((t) => {
        const p = document.createElement("p");
        p.innerHTML = t;
        p.className = "pText";
        section.appendChild(p);
      });

      contentEl.appendChild(section);
    }

    // steps
    if (block.type === "steps") {
      const section = document.createElement("section");
      section.className = "lesson-block";

      if (block.title) {
        const h3 = document.createElement("h3");
        h3.textContent = block.title;
        section.appendChild(h3);
      }

      const ol = document.createElement("ol");
      (block.items || []).forEach((stepText) => {
        const li = document.createElement("li");
        li.textContent = stepText;
        ol.appendChild(li);
      });

      section.appendChild(ol);
      contentEl.appendChild(section);
    }

    // gallery
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

      block.images.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "thumb";
        img.onclick = () => openImageFullscreen(src);
        gallery.appendChild(img);
      });

      section.appendChild(gallery);
      contentEl.appendChild(section);
    }

    // code
    if (block.type === "code") {
      const section = document.createElement("section");
      section.className = "lesson-block";

      if (block.title) {
        // Если заголовок — массив
        if (Array.isArray(block.title)) {
          block.title.forEach((t) => {
            const h3 = document.createElement("h3");
            h3.textContent = t;
            section.appendChild(h3);
          });
        }
        // Если заголовок — обычная строка
        else {
          const h3 = document.createElement("h3");
          h3.textContent = block.title;
          section.appendChild(h3);
        }
      }

      // Пояснение над кодом
      if (block.text) {
        const desc = document.createElement("p");
        desc.className = "code-description";
        desc.innerHTML = block.text;
        section.appendChild(desc);
      }

      // Код
      const pre = document.createElement("pre");
      const code = document.createElement("code");

      code.className = `language-${block.language || "lua"}`;
      code.textContent = block.code || "";
      pre.appendChild(code);
      section.appendChild(pre);

      // Пояснение под кодом — ВАЖНО: поддерживает массив!
      if (block.afterText) {
        const after = document.createElement("div");
        after.className = "code-after-text";

        // если afterText массив → выводим списком
        if (Array.isArray(block.afterText)) {
          block.afterText.forEach((line) => {
            const p = document.createElement("p");
            p.innerHTML = line;
            after.appendChild(p);
          });
        } else {
          // если строка
          const p = document.createElement("p");
          p.innerHTML = block.afterText;
          after.appendChild(p);
        }

        section.appendChild(after);
      }

      contentEl.appendChild(section);

      requestAnimationFrame(() => {
        hljs.highlightElement(code);
      });
    }

    // специальный блок цитаты
    if (block.type === "quote") {
      const blockquote = document.createElement("blockquote");
      blockquote.className = "quote-block";
      blockquote.innerHTML = block.text;
      contentEl.appendChild(blockquote);
    }

    // CODEBLOCK — заголовок + код + текст после кода
    if (block.type === "codeBlock") {
      const section = document.createElement("section");
      section.className = "lesson-block";

      // Заголовок
      if (block.title) {
        const h3 = document.createElement("h3");
        h3.textContent = block.title;
        section.appendChild(h3);
      }

      // Код
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.className = `language-${block.language || "lua"}`;
      code.textContent = block.code || "";
      pre.appendChild(code);
      section.appendChild(pre);

      // Пояснение под кодом
      if (block.afterText) {
        const p = document.createElement("p");
        p.innerHTML = block.afterText;
        section.appendChild(p);
      }

      contentEl.appendChild(section);

      requestAnimationFrame(() => {
        hljs.highlightElement(code);
      });
    }

    // NOTE
    if (block.type === "note") {
      const div = document.createElement("div");
      div.className = "note-block";
      div.innerHTML = block.text;
      contentEl.appendChild(div);
    }

    // WARNING
    if (block.type === "warning") {
      const div = document.createElement("div");
      div.className = "warning-block";
      div.innerHTML = block.text;
      contentEl.appendChild(div);
    }

    // TIP BLOCK — серый блок с вертикальной полоской
    if (block.type === "tip") {
      const section = document.createElement("section");
      section.className = "tip-block fade-in";

      // Заголовок
      if (block.title) {
        const h3 = document.createElement("h3");
        h3.textContent = block.title;
        section.appendChild(h3);
      }

      // --- ВАЖНО: преобразуем многострочный текст YAML в <ul><li> ---
      const text = block.text.trim();

      // Если строки начинаются с "-", делаем список
      if (text.startsWith("-")) {
        const ul = document.createElement("ul");

        text.split("\n").forEach((line) => {
          const cleaned = line.replace(/^-/, "").trim(); // убираем "- "
          if (cleaned.length > 0) {
            const li = document.createElement("li");
            li.innerHTML = cleaned;
            ul.appendChild(li);
          }
        });

        section.appendChild(ul);
      }
      // иначе — обычный текст
      else {
        const p = document.createElement("p");
        p.innerHTML = text.replace(/\n/g, "<br>");
        section.appendChild(p);
      }

      contentEl.appendChild(section);
    }

    // HINT BLOCK — скрытая подсказка (спойлер)
    // ------------------------------------------------------
    if (block.type === "hint") {
      const section = document.createElement("section");
      section.className = "lesson-block hint-block";

      // кнопка-заголовок
      const btn = document.createElement("button");
      btn.className = "hint-toggle";
      btn.textContent = block.title || "Подсказка";
      section.appendChild(btn);

      // --- Пояснение ПЕРЕД кодом (поддерживает массив) ---
      if (block.text) {
        const texts = Array.isArray(block.text) ? block.text : [block.text];

        texts.forEach((t) => {
          const p = document.createElement("p");
          p.className = "hint-description";
          p.innerHTML = t;
          section.appendChild(p);
        });
      }

      // скрытый контейнер для кода
      const hidden = document.createElement("div");
      hidden.className = "hint-content hidden";

      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.className = `language-lua`;
      code.textContent = block.code || "";
      pre.appendChild(code);
      hidden.appendChild(pre);

      section.appendChild(hidden);

      // --- Пояснение ПОСЛЕ кода (supports array) ---
      if (block.afterText) {
        const after = document.createElement("div");
        after.className = "code-after-text";

        const list = Array.isArray(block.afterText)
          ? block.afterText
          : [block.afterText];

        list.forEach((line) => {
          const p = document.createElement("p");
          p.innerHTML = line;
          after.appendChild(p);
        });

        section.appendChild(after);
      }

      contentEl.appendChild(section);

      // событие раскрытия
      btn.onclick = () => {
        hidden.classList.toggle("hidden");
        hljs.highlightElement(code);
      };
    }

    // ===============================
    // TABLE BLOCK — таблицы
    // ===============================
    if (block.type === "table") {
      const section = document.createElement("section");
      section.className = "lesson-block fade-in";

      // Заголовок таблицы
      if (block.title) {
        const h3 = document.createElement("h3");
        h3.textContent = block.title;
        section.appendChild(h3);
      }

      // Создаём таблицу
      const table = document.createElement("table");
      table.className = "lesson-table";

      // Заголовок (thead)
      if (block.headers) {
        const thead = document.createElement("thead");
        const tr = document.createElement("tr");

        block.headers.forEach((h) => {
          const th = document.createElement("th");
          th.textContent = h;
          tr.appendChild(th);
        });

        thead.appendChild(tr);
        table.appendChild(thead);
      }

      // Строки
      if (block.rows) {
        const tbody = document.createElement("tbody");

        block.rows.forEach((row) => {
          const tr = document.createElement("tr");
          row.forEach((cell) => {
            const td = document.createElement("td");
            td.innerHTML = cell;
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });

        table.appendChild(tbody);
      }

      section.appendChild(table);

      // Текст под таблицей
      if (block.afterText) {
        const p = document.createElement("p");
        p.innerHTML = block.afterText;
        p.className = "table-after-text";
        section.appendChild(p);
      }

      contentEl.appendChild(section);
    }
  });

  // QUIZ
  if (lesson.quiz && lesson.quiz.length > 0) {
    const title = document.createElement("h2");
    title.textContent = "Проверь себя";
    quizEl.appendChild(title);

    lesson.quiz.forEach((q, qIndex) => {
      const block = document.createElement("div");
      block.className = "quiz-question fade-in";

      const p = document.createElement("p");
      p.textContent = q.question;
      block.appendChild(p);

      q.answers.forEach((answer, aIndex) => {
        const label = document.createElement("label");
        const input = document.createElement("input");

        input.type = "radio";
        input.name = `q${qIndex}`;
        input.value = aIndex;

        label.appendChild(input);
        label.append(` ${answer}`);
        block.appendChild(label);
      });

      quizEl.appendChild(block);
    });

    const btn = document.createElement("button");
    btn.textContent = "Проверить ответы";

    btn.onclick = () => {
      let correctCount = 0;

      lesson.quiz.forEach((q, qIndex) => {
        const chosen = document.querySelector(
          `input[name="q${qIndex}"]:checked`
        );
        if (!chosen) return;
        if (Number(chosen.value) === q.correct) correctCount++;
      });

      alert(`Правильных ответов: ${correctCount} из ${lesson.quiz.length}`);
    };

    quizEl.appendChild(btn);
  }

  // END
  (lesson.end || []).forEach((block) => {
    // TEXT
    if (block.type === "text") {
      const section = document.createElement("section");
      section.className = "lesson-end-block fade-in";

      if (block.title) {
        if (Array.isArray(block.title)) {
          block.title.forEach((t) => {
            const h3 = document.createElement("h3");
            h3.textContent = t;
            section.appendChild(h3);
          });
        } else {
          const h3 = document.createElement("h3");
          h3.textContent = block.title;
          section.appendChild(h3);
        }
      }

      const texts = Array.isArray(block.text) ? block.text : [block.text];

      texts.forEach((t) => {
        const p = document.createElement("p");
        p.innerHTML = t;
        p.className = "pText";
        section.appendChild(p);
      });

      // ❗ ДОБАВЛЯЕМ В КОНЕЦ ОСНОВНОГО КОНТЕНТА, НЕ В QUIZ
      const endEl = document.getElementById("end-block");
      endEl.appendChild(section);
    }
  });
  
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
