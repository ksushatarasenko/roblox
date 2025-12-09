async function loadCourseData() {
  if (window._courseData) return window._courseData;

  const res = await fetch('data/lessons.json');
  const data = await res.json();
  window._courseData = data;
  return data;
}

function getModules(data) {
  return data.modules || [];
}

function findLessonById(data, lessonId) {
  const idNum = Number(lessonId);
  for (const module of data.modules) {
    const lesson = module.lessons.find(l => l.id === idNum);
    if (lesson) {
      return { module, lesson };
    }
  }
  return null;
}

window.courseApi = { loadCourseData, getModules, findLessonById };
