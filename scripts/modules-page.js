(async function () {

  // 1. Загружаем course.json
  const course = await fetch("data/course.json").then(r => r.json());

  const container = document.getElementById('modules-container');

  // 2. Проходим по каждому модулю
  for (const mod of course.modules) {
console.log("FETCH MODULE FILE:", mod.file);

    // 3. Загружаем YAML этого модуля
    const yamlText = await fetch(`data/${mod.file}`).then(r => r.text());
    const moduleData = jsyaml.load(yamlText);
console.log("YAML TEXT:", yamlText);

    // 4. Создаём карточку модуля
    const moduleEl = document.createElement('section');
    moduleEl.className = 'module-card fade-in';

    console.log("COURSE DATA:", course.modules);
    console.log("LOADED MODULE DATA:", moduleData);
    console.log("LOADED MODULE DATA:", moduleData);

    const title = document.createElement('h2');
    title.textContent = moduleData.title;

    const desc = document.createElement('p');
    desc.textContent = moduleData.description;

    const lessonsList = document.createElement('ul');

    // 5. Уроки внутри модуля
    moduleData.lessons.forEach(lesson => {
      const li = document.createElement('li');

      const link = document.createElement('a');
      link.href = `lesson.html?lessonId=${lesson.id}`;
      link.textContent = lesson.title;
      li.appendChild(link);

      if (lesson.shortDescription) {
        const small = document.createElement('div');
        small.className = 'lesson-short';
        small.textContent = lesson.shortDescription;
        li.appendChild(small);
      }

      lessonsList.appendChild(li);
    });

    moduleEl.appendChild(title);
    moduleEl.appendChild(desc);
    moduleEl.appendChild(lessonsList);

    container.appendChild(moduleEl);
  }

})();
