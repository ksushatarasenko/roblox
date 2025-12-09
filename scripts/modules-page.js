(async function () {
  const container = document.getElementById('modules-container');
  const data = await window.courseApi.loadCourseData();
  const modules = window.courseApi.getModules(data);

  modules.forEach(module => {
    const moduleEl = document.createElement('section');
    moduleEl.className = 'module-card fade-in';

    const title = document.createElement('h2');
    title.textContent = module.title;

    const desc = document.createElement('p');
    desc.textContent = module.description;

    const lessonsList = document.createElement('ul');
    module.lessons.forEach(lesson => {
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
  });
})();
