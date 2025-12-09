window.courseApi = {

  // =================================================
  // Загружаем список модулей + все YAML файлов модулей
  // =================================================
  async loadCourseData() {
    // 1. Загружаем course.json
    const course = await fetch("data/course.json").then(r => r.json());

    const modules = [];

    // 2. Загружаем каждый YAML модуль
    for (const mod of course.modules) {
      const yamlText = await fetch(`data/${mod.file}`).then(r => r.text());
      const moduleData = jsyaml.load(yamlText);

      console.log("=== LOADED MODULE FILE ===", mod.file);
      console.log("YAML RAW:", yamlText);
      console.log("PARSED YAML:", moduleData);

      modules.push({
        id: mod.id,
        title: mod.title,
        description: mod.description,
        lessons: moduleData.lessons
      });
    }

    // Возвращаем список модулей и уроков
    return { modules };
  },

  // =================================================
  // Находим урок по ID
  // =================================================
  findLessonById(courseData, lessonId) {
    for (const module of courseData.modules) {
      const lesson = module.lessons.find(l => l.id == lessonId);
      if (lesson) {
        return { module, lesson };
      }
    }
    return null;
  }
};


