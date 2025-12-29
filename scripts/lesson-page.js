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

      block.images.forEach((imgObj, index) => {
        const img = document.createElement("img");
        img.src = imgObj.src;
        img.className = "thumb";

        img.onclick = () => openImageFullscreen(block.images, index); // передаём ВСЕ картинки!

        gallery.appendChild(img);
      });

      section.appendChild(gallery);
      contentEl.appendChild(section);
    }

    // oneImae
    if (block.type === "oneImage") {
      const section = document.createElement("section");
      section.className = "lesson-block fade-in";

      // Заголовок
      if (block.title) {
        const h3 = document.createElement("h3");
        h3.textContent = block.title;
        section.appendChild(h3);
      }

      // HTML-текст НАД картинкой
      if (block.textTop) {
        const topText = document.createElement("div");
        topText.className = "text-top";
        topText.innerHTML = block.textTop; // 🔥 ВАЖНО
        section.appendChild(topText);
      }

      // Картинка
      const gallery = document.createElement("div");
      gallery.className = "image";

      const img = document.createElement("img");
      img.src = block.img.src;
      if (block.img.width) {
        if (typeof block.img.width === "number") {
          img.style.width = block.img.width + "px";
        } else {
          img.style.width = block.img.width; // "80%"
        }
      }

      if (block.img.maxWidth) {
        img.style.maxWidth = block.img.maxWidth;
      }
      // img.style.width = block.img.width + "px";
      // img.style.maxWidth = block.img.maxWidth;
      img.className = "thumb";
      img.onclick = () => {
        openImageFullscreen([block.img], 0);
      };

      gallery.appendChild(img);
      section.appendChild(gallery);

      // HTML-текст ПОД картинкой
      if (block.textBottom) {
        const bottomText = document.createElement("div");
        bottomText.className = "text-bottom";
        bottomText.innerHTML = block.textBottom; // 🔥 ВАЖНО
        section.appendChild(bottomText);
      }

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
      const hasText = block.text && block.text.length > 0;
      const hasCode = block.code && block.code.trim() !== "";
      const hasAfter = block.afterText && block.afterText.length > 0;

      // ❌ если вообще нечего показывать — не рендерим
      if (!hasText && !hasCode && !hasAfter) return;

      const section = document.createElement("section");
      section.className = "lesson-block hint-block";

      // КНОПКА
      const btn = document.createElement("button");
      btn.className = "hint-toggle";
      btn.textContent = block.title || "Подсказка";
      section.appendChild(btn);

      // СКРЫТЫЙ КОНТЕНТ
      const hidden = document.createElement("div");
      hidden.className = "hint-content hidden";

      // -------- ТЕКСТ --------
      if (hasText) {
        const texts = Array.isArray(block.text) ? block.text : [block.text];

        texts.forEach((line) => {
          const p = document.createElement("p");
          p.className = "hint-description";
          p.innerHTML = line;
          hidden.appendChild(p);
        });
      }

      // -------- КОД --------
      let codeEl = null;

      if (hasCode) {
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.className = "language-lua";
        code.textContent = block.code;

        pre.appendChild(code);
        hidden.appendChild(pre);
        codeEl = code;
      }

      // -------- ТЕКСТ ПОСЛЕ --------
      if (hasAfter) {
        const afterList = Array.isArray(block.afterText)
          ? block.afterText
          : [block.afterText];

        afterList.forEach((line) => {
          const p = document.createElement("p");
          p.className = "hint-after-text";
          p.innerHTML = line;
          hidden.appendChild(p);
        });
      }

      section.appendChild(hidden);
      contentEl.appendChild(section);

      // -------- КЛИК --------
      btn.onclick = () => {
        hidden.classList.toggle("hidden");

        if (codeEl) {
          hljs.highlightElement(codeEl);
        }
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
// ===============================
// FULLSCREEN CAROUSEL VIEWER
// ===============================
function openImageFullscreen(images, startIndex = 0) {
  let currentIndex = startIndex;

  // overlay
  const overlay = document.createElement("div");
  overlay.className = "image-overlay";

  // wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "image-viewer";

  // image element
  const img = document.createElement("img");
  img.className = "fullscreen-image";

  // caption
  const caption = document.createElement("div");
  caption.className = "image-caption";

  // left/right buttons
  const btnPrev = document.createElement("button");
  btnPrev.className = "image-nav prev";
  btnPrev.innerHTML = "⟵";

  const btnNext = document.createElement("button");
  btnNext.className = "image-nav next";
  btnNext.innerHTML = "⟶";

  // load image
  function updateImage() {
    img.src = images[currentIndex].src;

    const text = images[currentIndex].caption;
    caption.textContent = text && text.trim() !== "" ? text : "";
    caption.style.display = text ? "block" : "none";
  }

  updateImage();

  // closing
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  // navigation
  btnPrev.onclick = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  };

  btnNext.onclick = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  };

  // assembling
  wrapper.appendChild(btnPrev);
  wrapper.appendChild(img);
  wrapper.appendChild(btnNext);
  wrapper.appendChild(caption);
  overlay.appendChild(wrapper);

  document.body.appendChild(overlay);
}
