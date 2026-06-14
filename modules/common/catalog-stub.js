(() => {
  const config = window.CATALOG_STUB || {};
  const statusText = {
    draft: "Заготовка модуля",
    question: "Требует решения",
    ready: "Модуль есть"
  };

  function categoryKey() {
    const value = String(config.category || "").toLowerCase();
    if (["round", "rectangular", "combined"].includes(value)) {
      return value;
    }
    if (value.includes("круг") || value.includes("round")) {
      return "round";
    }
    if (value.includes("прям") || value.includes("rect")) {
      return "rectangular";
    }
    if (value.includes("комб") || value.includes("combined")) {
      return "combined";
    }
    return "";
  }

  function openAtlas(category = "") {
    category = String(category || "");
    category = category ? (["round", "rectangular", "combined"].includes(category) ? category : categoryKey()) : "";

    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "calcSquare:showAtlasCatalog",
          mode: category ? "category" : "all",
          category
        },
        "*"
      );
      return;
    }

    const url = new URL("../../../assets/atlas/atlas.html", window.location.href);
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    const lang = params.get("lang");
    if (role) {
      url.searchParams.set("role", role);
    }
    if (lang) {
      url.searchParams.set("lang", lang);
    }
    url.searchParams.set("view", category ? "category" : "all");
    if (category) {
      url.searchParams.set("category", category);
      url.hash = category;
    }
    window.location.href = url.href;
  }

  document.title = config.title || "Calc Square";
  document.body.innerHTML = `
    <nav class="stub-nav">
      <button id="stubAtlas" type="button">← Атлас</button>
      ${categoryKey() ? `<button id="stubCategory" type="button">${config.category} →</button>` : ""}
    </nav>
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

  document.getElementById("stubAtlas")?.addEventListener("click", () => {
    openAtlas();
  });
  document.getElementById("stubCategory")?.addEventListener("click", () => {
    openAtlas(categoryKey());
  });
})();
