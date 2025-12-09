// Получение параметров из URL, например ?lessonId=1
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

window.appRouter = { getQueryParam };
