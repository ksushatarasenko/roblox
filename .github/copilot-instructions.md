# Copilot / AI agent instructions — Roblox course site

Короткие, конкретные указания для AI-ассистента, чтобы быстро работать с этим репозиторием.

1) Большая картина
- Это статический фронтенд (HTML/CSS/JS) — нет сборки. Контент курсов хранится в JSON/YAML в `data/`.
- `data/course.json` перечисляет модули; каждое значение `file` указывает на YAML в `data/modules/`.
- JS на клиенте загружает `course.json` и парсит YAML через `js-yaml` (CDN). См. `scripts/courseApi.js`.

2) Ключевые файлы и флоу данных (важно)
- Роутинг: `scripts/router.js` — утилиты для чтения query-параметров (напр. `lessonId`).
- Модули: `modules.html` + `scripts/modules-page.js` читают `course.json` → подгружают `data/modules/*.yml` и создают ссылки `lesson.html?lessonId=...`.
- Страница урока: `lesson.html` + `scripts/lesson-page.js` — основная логика рендеринга блоков из YAML.
- Пример YAML-модуля: `data/modules/module4.yml` (структура `lessons: [{id,title,content:[...]}, ...]`).

3) Конвенции контента (важно для генерации/правок)
- Блоки контента: types = `text`, `steps`, `gallery`, `oneImage`, `code`, `codeBlock`, `note`, `warning`, `tip`, `hint`, `table`, `quote` и т.д. Реализация в `scripts/lesson-page.js`.
- Поля могут быть строкой или массивом — рендерер поддерживает оба формата (напр. `title`, `text`, `afterText`).
- Поля содержат HTML: код использует `innerHTML` в нескольких местах. Не удаляйте HTML без проверки (опасность XSS только если содержимое ненадёжное).
- `code` блоки: указывайте `language` (по умолчанию `lua`) — подсветка через highlight.js. Для блоков с кодом рендерер ставит `code.textContent` и затем вызывает `hljs.highlightElement()`.
- `oneImage` блок: `img.width` может быть числом (px) или строкой ("80%").
- Идентификаторы уроков (`lesson.id`) используются глобально в ссылках `lesson.html?lessonId=...` — убедитесь в уникальности ID.

4) Добавление нового модуля / урока (примерный чеклист)
- Создать `data/modules/moduleX.yml` с `id`, `title`, `description`, `lessons: [...]`.
- Добавить запись в `data/course.json` с `file: "modules/moduleX.yml"`.
- Проверить: `modules.html` отображает модуль; `lesson.html?lessonId=NN` загружает и рендерит урок.

5) Как запускать и отлаживать локально
- Проект — статический. Для локального теста запустите простой HTTP-сервер в корне репо, напр.: 
  - `python3 -m http.server 8000` или `npx http-server -c-1`.
- Открывайте `http://localhost:8000/index.html` в браузере.
- Логи: многие файлы пишут `console.log` (особенно `scripts/courseApi.js`, `scripts/modules-page.js`) — смотрите DevTools Console.

6) Частые ловушки и примечания
- YAML → HTML: рендерер использует `innerHTML` для текстов и описаний — при автогенерации контента вставляйте только безопасный HTML.
- Парсинг YAML: используется `js-yaml` из CDN; убедитесь, что YAML корректен (отступы, массивы). Ошибки парсинга видны в консоли.
- Не добавляйте серверную логику — весь код ожидается на клиенте.

7) Полезные ссылки в репо (быстро)
- Рендерер контента: `scripts/lesson-page.js`
- Загрузка модулей: `scripts/courseApi.js`
- Карта сайта / старт: `index.html`, `modules.html`, `lesson.html`
- Примеры данных: `data/course.json`, `data/modules/module4.yml`, `data/lessons.json`

Если нужно, могу:
- добавить примеры шаблонов YAML для новых типов блоков;
- написать скрипт-валидатор YAML (node/python) для проверки структуры;
- расширить инструкцию интеграции при добавлении внешних ассетов.

Пожалуйста, скажите, какие разделы хотите расширить или какие примеры YAML добавить.
