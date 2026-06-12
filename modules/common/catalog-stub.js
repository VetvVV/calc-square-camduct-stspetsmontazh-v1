(() => {
  const config = window.CATALOG_STUB || {};
  const statusText = {
    draft: "Заготовка модуля",
    question: "Требует решения",
    ready: "Модуль есть"
  };

  document.title = config.title || "Calc Square";
  document.body.innerHTML = `
    <main class="stub-card">
      <section class="stub-preview">
        <img src="../../common/stub-preview.svg" alt="">
      </section>
      <section class="stub-info">
        <p class="stub-kicker">${config.category || "Каталог"}</p>
        <h1>${config.title || "Новый модуль"}</h1>
        <dl>
          <div><dt>Пункт методички</dt><dd>${config.method || "уточнить"}</dd></div>
          <div><dt>Статус</dt><dd>${statusText[config.status] || statusText.draft}</dd></div>
        </dl>
        <p class="stub-note">${config.note || "Папка создана для будущей карточки калькулятора. Формула, размеры и изображение будут добавлены после сверки."}</p>
      </section>
    </main>
  `;
})();
