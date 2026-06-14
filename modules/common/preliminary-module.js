(() => {
  const config = window.CALC_MODULE || {};
  const params = new URLSearchParams(window.location.search);
  const allowedRoles = new Set(["guest", "user", "client", "admin"]);
  const role = allowedRoles.has(params.get("role")) ? params.get("role") : "guest";
  const lang = params.get("lang") || "ru";
  const editIndexParam = params.get("editIndex");
  const isEdit = editIndexParam !== null && editIndexParam !== "";
  const isAdmin = role === "admin";
  const canAdd = role !== "guest";

  const materials = [
    { key: "galv", label: "Оцинкованная сталь", density: 7850, thickness: [0.5, 0.55, 0.7, 0.8, 0.9, 1.0] },
    { key: "ss430", label: "Нержавеющая сталь 430 техническая", density: 7850, thickness: [0.55, 0.7, 0.8, 1.0] },
    { key: "ss304", label: "Нержавеющая сталь 304 пищевая", density: 8000, thickness: [0.55, 0.7, 0.8, 1.0] },
    { key: "al", label: "Алюминий", density: 2700, thickness: [0.5, 0.7, 0.8, 1.0] }
  ];

  const labels = {
    ru: {
      material: "Материал",
      thickness: "Толщина",
      qty: "Количество",
      area: "Площадь",
      mass: "Масса изделия",
      add: "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432 \u043f\u0440\u043e\u0435\u043a\u0442",
      saveChanges: "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f",
      calculate: "\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044c",
      available: "\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u043e \u0440\u0430\u0441\u0447\u0435\u0442\u043e\u0432 \u0441\u0435\u0433\u043e\u0434\u043d\u044f",
      limitReached: "\u041b\u0438\u043c\u0438\u0442 \u0440\u0430\u0441\u0447\u0435\u0442\u043e\u0432 \u043d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f \u0438\u0441\u0447\u0435\u0440\u043f\u0430\u043d",
      note: "Предварительный расчет",
      formula: "Формула",
      substitution: "Подстановка",
      units: "мм",
      kg: "кг",
      m2: "м²",
      of: "из",
      atlas: "← Атлас",
      round: "Круглые",
      rectangular: "Прямоугольные",
      combined: "Комбинированные",
      sizes: "Размеры",
      options: "Опции",
      detail: "Деталь",
      connectors: "Соединители",
      help: "Помощь",
      expandAll: "Развернуть всё",
      collapseAll: "Свернуть всё",
      simpleMode: "Простой",
      fullMode: "Полный",
      resetLayout: "Сбросить раскладку",
      hidden: "Скрыто",
      specDescription: "Описание (спецификация)",
      connectorPlaceholder: "Соединители будут уточняться для каждого изделия.",
      helpText: "Подсказки по размерам и обозначениям будут наполняться по мере уточнения карточки."
    },
    uk: {
      material: "Матеріал",
      thickness: "Товщина",
      qty: "Кількість",
      area: "Площа",
      mass: "Маса виробу",
      add: "\u0414\u043e\u0434\u0430\u0442\u0438 \u0432 \u043f\u0440\u043e\u0435\u043a\u0442",
      saveChanges: "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0437\u043c\u0456\u043d\u0438",
      calculate: "\u0420\u043e\u0437\u0440\u0430\u0445\u0443\u0432\u0430\u0442\u0438",
      available: "\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u043e \u0440\u043e\u0437\u0440\u0430\u0445\u0443\u043d\u043a\u0456\u0432 \u0441\u044c\u043e\u0433\u043e\u0434\u043d\u0456",
      limitReached: "\u041b\u0456\u043c\u0456\u0442 \u0440\u043e\u0437\u0440\u0430\u0445\u0443\u043d\u043a\u0456\u0432 \u043d\u0430 \u0441\u044c\u043e\u0433\u043e\u0434\u043d\u0456 \u0432\u0438\u0447\u0435\u0440\u043f\u0430\u043d\u043e",
      note: "Попередній розрахунок",
      formula: "Формула",
      substitution: "Підстановка",
      units: "мм",
      kg: "кг",
      m2: "м²",
      of: "з",
      atlas: "← Атлас",
      round: "Круглі",
      rectangular: "Прямокутні",
      combined: "Комбіновані",
      sizes: "Розміри",
      options: "Опції",
      detail: "Деталь",
      connectors: "З'єднувачі",
      help: "Допомога",
      expandAll: "Розгорнути все",
      collapseAll: "Згорнути все",
      simpleMode: "Простий",
      fullMode: "Повний",
      resetLayout: "Скинути розкладку",
      hidden: "Приховано",
      specDescription: "Опис (специфікація)",
      connectorPlaceholder: "З'єднувачі будуть уточнюватися для кожного виробу.",
      helpText: "Підказки щодо розмірів і позначень будуть наповнюватися під час уточнення картки."
    },
    en: {
      material: "Material",
      thickness: "Thickness",
      qty: "Quantity",
      area: "Area",
      mass: "Product mass",
      add: "Add to project",
      saveChanges: "Save changes",
      calculate: "Calculate",
      available: "Calculations available today",
      limitReached: "Daily calculation limit reached",
      note: "Preliminary calculation",
      formula: "Formula",
      substitution: "Substitution",
      units: "mm",
      kg: "kg",
      m2: "m²",
      of: "of",
      atlas: "← Atlas",
      round: "Round",
      rectangular: "Rectangular",
      combined: "Combined",
      sizes: "Dimensions",
      options: "Options",
      detail: "Detail",
      connectors: "Connectors",
      help: "Help",
      expandAll: "Expand all",
      collapseAll: "Collapse all",
      simpleMode: "Simple",
      fullMode: "Full",
      resetLayout: "Reset layout",
      hidden: "Hidden",
      specDescription: "Specification description",
      connectorPlaceholder: "Connectors will be refined for each product.",
      helpText: "Dimension and label hints will be filled in as the card is refined."
    }
  };

  const t = labels[lang] || labels.ru;
  const nf = (value, digits = 3) => Number(value || 0).toFixed(digits);
  const byId = (id) => document.getElementById(id);
  const guestLimit = 5;
  const guestUsageKey = "calcSquarePreliminaryGuestUsage";

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function guestUsage() {
    try {
      const usage = JSON.parse(localStorage.getItem(guestUsageKey) || "{}");
      if (usage.date !== todayKey()) {
        return { date: todayKey(), used: 0 };
      }
      return { date: usage.date, used: Math.max(0, Number(usage.used) || 0) };
    } catch (error) {
      return { date: todayKey(), used: 0 };
    }
  }

  function setGuestUsage(usage) {
    localStorage.setItem(guestUsageKey, JSON.stringify(usage));
  }

  function guestRemaining() {
    return Math.max(0, guestLimit - guestUsage().used);
  }

  function refreshGuestCounter() {
    const counter = byId("guest-counter");
    const button = byId("guest-calculate");
    if (!counter || !button) {
      return;
    }
    const remaining = guestRemaining();
    counter.textContent = `${t.available}: ${remaining} ${t.of} ${guestLimit}`;
    button.disabled = remaining <= 0;
    button.textContent = remaining <= 0 ? t.limitReached : t.calculate;
  }

  function consumeGuestCalculation() {
    if (role !== "guest") {
      return true;
    }
    const usage = guestUsage();
    if (guestLimit - usage.used <= 0) {
      refreshGuestCounter();
      return false;
    }
    usage.used += 1;
    setGuestUsage(usage);
    refreshGuestCounter();
    return true;
  }

  function range(from, to, step) {
    const values = [];
    for (let value = from; value <= to; value += step) {
      values.push(value);
    }
    return values;
  }

  const standardOptions = {
    D: [80, 100, 125, 150, 160, 180, 200, 225, 250, 280, 300, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000, 1120, 1250],
    D1: [80, 100, 125, 150, 160, 180, 200, 225, 250, 280, 300, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000, 1120, 1250],
    D2: [80, 100, 125, 150, 160, 180, 200, 225, 250, 280, 300, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000, 1120, 1250],
    A: range(100, 2000, 50),
    A1: range(100, 2000, 50),
    B: range(100, 1600, 50),
    B1: range(100, 1600, 50),
    C: range(100, 3000, 50),
    H: range(100, 1600, 50),
    R: range(100, 1600, 50),
    Offset: range(50, 1200, 50),
    Angle: [15, 30, 45, 60, 90]
  };

  function fieldOptions(field) {
    if (Array.isArray(field.options) && field.options.length) {
      return field.options;
    }
    return standardOptions[field.key] || null;
  }

  function initialNumber(key, fallback) {
    const raw = params.get(key);
    const value = Number(String(raw || "").replace(",", "."));
    return Number.isFinite(value) && raw !== null && raw !== "" ? value : Number(fallback || 0);
  }

  function initialText(key, fallback) {
    const raw = params.get(key);
    return raw !== null && raw !== "" ? raw : fallback;
  }

  function renderField(field) {
    const options = fieldOptions(field);
    const selectedValue = initialNumber(field.key, field.default);
    if (options) {
      const hasDefault = options.includes(selectedValue);
      const values = hasDefault ? options : [selectedValue, ...options].filter((value, index, array) => array.indexOf(value) === index);
      return `
        <label>
          ${field.label}
          <select id="field-${field.key}">
            ${values.map((value) => `<option value="${value}" ${selectedValue === value ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </label>
      `;
    }
    return `
      <label>
        ${field.label}
        <input id="field-${field.key}" type="number" min="0" step="${field.step || 1}" value="${selectedValue || 0}">
      </label>
    `;
  }

  function fieldValue(key) {
    const node = byId(`field-${key}`);
    return Number(node?.value || 0);
  }

  function mm2ToM2(value) {
    return value / 1000000;
  }

  function arcLength(radius, angle) {
    return Math.PI * radius * angle / 180;
  }

  function calculate(values) {
    const q = Math.max(1, values.Q || 1);
    let mm2 = 0;
    let formula = "";
    let substitution = "";

    switch (config.formula) {
      case "round-duct":
        mm2 = Math.PI * values.D * values.C * q;
        formula = "S = π × D × C × Q";
        substitution = `π × ${values.D} × ${values.C} × ${q}`;
        break;
      case "round-elbow": {
        const arc = arcLength(values.R, values.Angle);
        mm2 = Math.PI * values.D * arc * q;
        formula = "S = π × D × (π × R × α / 180) × Q";
        substitution = `π × ${values.D} × (${nf(arc, 1)}) × ${q}`;
        break;
      }
      case "round-transition":
        mm2 = Math.PI * ((values.D1 + values.D2) / 2) * values.C * q;
        formula = "S = π × ((D1 + D2) / 2) × C × Q";
        substitution = `π × ((${values.D1} + ${values.D2}) / 2) × ${values.C} × ${q}`;
        break;
      case "round-tee":
        mm2 = (Math.PI * values.D * values.C + Math.PI * values.D1 * values.H) * q;
        formula = "S = (π × D × C + π × D1 × H) × Q";
        substitution = `(π × ${values.D} × ${values.C} + π × ${values.D1} × ${values.H}) × ${q}`;
        break;
      case "round-cap":
        mm2 = Math.PI * values.D * values.D / 4 * q;
        formula = "S = π × D² / 4 × Q";
        substitution = `π × ${values.D}² / 4 × ${q}`;
        break;
      case "round-offset":
        mm2 = Math.PI * values.D * values.C * 1.12 * q;
        formula = "S = π × D × C × 1.12 × Q";
        substitution = `π × ${values.D} × ${values.C} × 1.12 × ${q}`;
        break;
      case "rectangular-elbow": {
        const arc = arcLength(values.R, values.Angle);
        mm2 = 2 * (values.A + values.B) * arc * q;
        formula = "S = 2 × (A + B) × (π × R × α / 180) × Q";
        substitution = `2 × (${values.A} + ${values.B}) × ${nf(arc, 1)} × ${q}`;
        break;
      }
      case "rectangular-transition": {
        const p1 = 2 * (values.A + values.B);
        const p2 = 2 * (values.A1 + values.B1);
        mm2 = ((p1 + p2) / 2) * values.C * q;
        formula = "S = ((2(A+B) + 2(A1+B1)) / 2) × C × Q";
        substitution = `((${p1} + ${p2}) / 2) × ${values.C} × ${q}`;
        break;
      }
      case "rectangular-cap":
        mm2 = (values.A * values.B + 2 * values.C * (values.A + values.B) + values.C * values.C) * q;
        formula = "S = (A × B + 2 × C × (A + B) + C²) × Q";
        substitution = `(${values.A} × ${values.B} + 2 × ${values.C} × (${values.A} + ${values.B}) + ${values.C}²) × ${q}`;
        break;
      case "combined-round-to-rectangular":
        mm2 = ((values.D / 2 + values.A) * values.L + (values.D / 2 + values.B) * values.L) * 1.15 * q;
        formula = "S = ((D/2 + A) × L + (D/2 + B) × L) × 1.15 × Q";
        substitution = `((${values.D}/2 + ${values.A}) × ${values.L} + (${values.D}/2 + ${values.B}) × ${values.L}) × 1.15 × ${q}`;
        break;
      default:
        mm2 = Math.PI * (values.D || 200) * (values.C || 500) * q;
        formula = "S = π × D × C × Q";
        substitution = `π × ${values.D || 200} × ${values.C || 500} × ${q}`;
    }

    return {
      area: mm2ToM2(mm2),
      formula,
      substitution
    };
  }

  function currentValues() {
    const values = {};
    (config.fields || []).forEach((field) => {
      values[field.key] = fieldValue(field.key);
    });
    values.Q = fieldValue("Q") || 1;
    return values;
  }

  function dimensionText(values) {
    return (config.dimensionKeys || config.fields || [])
      .filter((field) => field.key !== "Q" && values[field.key])
      .map((field) => `${field.key} ${values[field.key]}`)
      .join(" × ") + " мм";
  }

  function renderThicknessOptions() {
    const material = materials.find((item) => item.key === byId("material")?.value) || materials[0];
    const selected = initialNumber("thickness", byId("thickness")?.value || material.thickness[0]);
    byId("thickness").innerHTML = material.thickness
      .map((value) => `<option value="${value}" ${value === selected ? "selected" : ""}>${value}</option>`)
      .join("");
  }

  function updatePreview(values) {
    document.querySelectorAll("[data-dim-label]").forEach((node) => {
      const key = node.dataset.dimLabel;
      if (values[key]) {
        node.textContent = `${key} = ${values[key]}`;
      }
    });
  }

  function update() {
    const values = currentValues();
    const result = calculate(values);
    const material = materials.find((item) => item.key === byId("material").value) || materials[0];
    const thickness = Number(byId("thickness").value || 0.5);
    const mass = result.area * thickness * material.density / 1000;

    updatePreview(values);
    byId("area").textContent = `${nf(result.area)} ${t.m2}`;
    byId("mass").textContent = `${nf(mass, 2)} ${t.kg}`;
    byId("formula").textContent = result.formula;
    byId("substitution").textContent = `${result.substitution} ÷ 1 000 000 = ${nf(result.area)} ${t.m2}`;
    const descLine = byId("desc-line");
    if (descLine) {
      descLine.textContent = config.description || dimensionText(values) || t.note;
    }

    return { values, result, material, thickness, mass };
  }

  function categoryLabel() {
    const category = moduleCategory();
    return t[category] || config.category || "";
  }

  function normalizeCategory(category) {
    const value = String(category || "").toLowerCase();
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

  function moduleCategory() {
    const configuredCategory = normalizeCategory(config.category);
    if (configuredCategory) {
      return configuredCategory;
    }

    const path = window.location.pathname.toLowerCase();
    if (path.includes("/modules/round/")) {
      return "round";
    }
    if (path.includes("/modules/rectangular/")) {
      return "rectangular";
    }
    if (path.includes("/modules/combined/")) {
      return "combined";
    }
    return "";
  }

  function ensureNavStyles() {
    if (document.getElementById("preliminary-nav-styles")) {
      return;
    }

    if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Exo+2"]')) {
      const fontLink = document.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.href = "https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&display=swap";
      document.head.appendChild(fontLink);
    }

    const style = document.createElement("style");
    style.id = "preliminary-nav-styles";
    style.textContent = `
      body{
        font-family:'Exo 2',Arial,sans-serif;
        font-style:italic;
        background:#ececec;
        color:#222;
      }
      button,
      input,
      select,
      textarea,
      .module-card,
      .result-panel{
        font-family:'Exo 2',Arial,sans-serif;
      }
      button,
      input,
      select,
      textarea,
      .result-panel,
      .form-panel{
        font-style:normal;
      }
      .module-nav{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        margin:0 0 18px;
      }
      .module-nav button{
        border:0;
        border-radius:8px;
        padding:9px 14px;
        background:#eef0f3;
        color:#333;
        font-weight:700;
        cursor:pointer;
      }
      .module-nav button:hover{background:#dfe3e8;}
      .module-nav .module-category-button::after{content:" →";}
      .module-card{
        width:min(820px,calc(100vw - 32px));
      }
      .module-title-row{
        display:flex;
        align-items:center;
        gap:12px;
        margin:0 0 20px;
        flex-wrap:wrap;
      }
      .module-title-row h1{
        margin:0;
      }
      .module-layout{
        display:grid;
        grid-template-columns:minmax(280px,1fr) 320px;
        gap:22px;
        align-items:start;
      }
      .module-left-column{
        display:flex;
        flex-direction:column;
        gap:18px;
      }
      .preview-panel svg,
      .preview-panel object,
      .preview{
        width:100%;
        height:250px;
      }
      .form-panel{
        padding:0;
        overflow:hidden;
      }
      .panel-controls{
        display:flex;
        flex-wrap:nowrap;
        gap:5px;
        align-items:center;
        padding:7px 9px;
        background:#e7dcbf;
        border-bottom:1px solid #d6cdb7;
      }
      .panel-controls button{
        border:1px solid #cdbf98;
        background:#fff;
        color:#5b4e2a;
        font-family:inherit;
        font-size:13px;
        font-weight:600;
        padding:5px 8px;
        border-radius:6px;
        cursor:pointer;
        line-height:1;
      }
      .panel-controls button:hover{background:#f6f0df;}
      .panel-controls .ico{font-size:16px;padding:4px 9px;}
      .panel-controls .seg{
        display:inline-flex;
        border:1px solid #cdbf98;
        border-radius:6px;
        overflow:hidden;
      }
      .panel-controls .seg button{
        border:0;
        border-radius:0;
        border-right:1px solid #e0d4b0;
        font-size:12px;
      }
      .panel-controls .seg button:last-child{border-right:0;}
      .panel-controls .seg button.active{
        background:#d97706;
        color:#fff;
      }
      .panel-controls .reset{margin-left:auto;color:#9a7b3a;}
      .panels{
        max-height:calc(100vh - 170px);
        overflow-y:auto;
      }
      .panel{border-bottom:1px solid #e7ddc2;}
      .panel:last-of-type{border-bottom:0;}
      .panel-head{
        display:flex;
        align-items:center;
        gap:8px;
        padding:9px 12px;
        background:#efe6cf;
        cursor:pointer;
        user-select:none;
      }
      .panel-head:hover{background:#eae0c6;}
      .panel-head .drag{
        cursor:grab;
        color:#bcae82;
        font-size:15px;
        padding:0 2px;
      }
      .panel-head .caret{
        color:#9a8c5e;
        font-size:11px;
        width:12px;
        transition:transform .15s;
      }
      .panel.collapsed .panel-head .caret{transform:rotate(-90deg);}
      .panel-head .title{
        flex:1;
        font-weight:600;
        font-size:14px;
        color:#5b4e2a;
      }
      .panel-head .hide{
        border:0;
        background:transparent;
        color:#bcae82;
        font-size:17px;
        cursor:pointer;
        padding:1px 7px;
        border-radius:4px;
      }
      .panel-head .hide:hover{
        background:#e0d4b0;
        color:#b00;
      }
      .panel-body{padding:11px 12px;}
      .panel.collapsed .panel-body{display:none;}
      .panel.dragging{opacity:.45;}
      .panel.drag-over{box-shadow:inset 0 3px 0 #d97706;}
      .panel-body label{
        display:block;
        margin-bottom:10px;
        font-size:14.5px;
      }
      .panel-body label:last-child{margin-bottom:0;}
      .panel-body input,
      .panel-body select{
        display:block;
        width:100%;
        height:34px;
        margin-top:5px;
        padding:6px 10px;
        border:1px solid #888;
        border-radius:4px;
        background:#fff;
        font-size:16px;
        font-family:inherit;
      }
      .tab-empty,
      .help-text{
        color:#6d6247;
        font-size:13px;
        line-height:1.45;
        margin:0;
      }
      .hidden-bar{
        display:flex;
        flex-wrap:wrap;
        gap:6px;
        align-items:center;
        padding:9px 12px;
        background:#f0ead8;
        border-top:1px solid #e7ddc2;
        font-size:13px;
        color:#8a7c52;
      }
      .hidden-bar .chip{
        background:#fff;
        border:1px solid #d6cdb7;
        border-radius:14px;
        padding:3px 11px;
        cursor:pointer;
        font-size:12px;
        font-weight:600;
        color:#5b4e2a;
      }
      .hidden-bar .chip::before{content:"+ ";color:#1455ff;}
      .result-panel{
        margin-top:0;
      }
      .result-panel .row{
        margin-bottom:12px;
      }
      .result-panel .row b{
        display:block;
        font-size:18px;
      }
      @media(max-width:780px){
        .module-layout{grid-template-columns:1fr;}
        .module-card h1{font-size:22px;}
      }
    `;
    document.head.appendChild(style);
  }

  function showAtlas(category = "") {
    category = normalizeCategory(category);

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
    url.searchParams.set("role", role);
    url.searchParams.set("lang", lang);
    url.searchParams.set("view", category ? "category" : "all");
    if (category) {
      url.searchParams.set("category", category);
      url.hash = category;
    }
    window.location.href = url.href;
  }

  function initModulePanels() {
    const panels = byId("module-panels");
    const hiddenBar = byId("module-hidden-panels");
    const controls = document.querySelector(".panel-controls");
    if (!panels || !hiddenBar || !controls) {
      return;
    }

    const titles = {
      "panel-sizes": t.sizes,
      "panel-options": t.options,
      "panel-detail": t.detail,
      "panel-connectors": t.connectors,
      "panel-help": t.help
    };
    const defaultState = {
      order: ["panel-sizes", "panel-options", "panel-detail", "panel-connectors", "panel-help"],
      collapsed: ["panel-options", "panel-connectors", "panel-help"],
      hidden: []
    };
    const key = `calcSquareModulePanels:${config.productType || config.formula || "module"}`;

    function readState() {
      try {
        return JSON.parse(localStorage.getItem(key) || "null") || defaultState;
      } catch (error) {
        return defaultState;
      }
    }

    function writeState() {
      const state = {
        order: Array.from(panels.children).map((panel) => panel.id),
        collapsed: Array.from(panels.children).filter((panel) => panel.classList.contains("collapsed")).map((panel) => panel.id),
        hidden: Array.from(panels.children).filter((panel) => panel.hidden).map((panel) => panel.id)
      };
      localStorage.setItem(key, JSON.stringify(state));
    }

    function renderHidden() {
      const hiddenPanels = Array.from(panels.children).filter((panel) => panel.hidden);
      hiddenBar.innerHTML = `<span>${t.hidden}:</span>`;
      hiddenPanels.forEach((panel) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip";
        chip.dataset.panelId = panel.id;
        chip.textContent = titles[panel.id] || panel.id;
        hiddenBar.appendChild(chip);
      });
      hiddenBar.hidden = hiddenPanels.length === 0;
    }

    function applyState(state) {
      (state.order || defaultState.order).forEach((id) => {
        const panel = byId(id);
        if (panel) {
          panels.appendChild(panel);
        }
      });
      Array.from(panels.children).forEach((panel) => {
        panel.classList.toggle("collapsed", (state.collapsed || []).includes(panel.id));
        panel.hidden = (state.hidden || []).includes(panel.id);
      });
      renderHidden();
    }

    function setPreset(name) {
      controls.querySelectorAll("[data-panel-preset]").forEach((button) => {
        button.classList.toggle("active", button.dataset.panelPreset === name);
      });
    }

    panels.addEventListener("click", (event) => {
      if (event.target.closest(".hide") || event.target.closest(".drag")) {
        return;
      }
      const head = event.target.closest(".panel-head");
      if (!head) {
        return;
      }
      head.parentElement.classList.toggle("collapsed");
      writeState();
    });

    panels.addEventListener("click", (event) => {
      const hide = event.target.closest(".hide");
      if (!hide) {
        return;
      }
      event.stopPropagation();
      hide.closest(".panel").hidden = true;
      renderHidden();
      writeState();
    });

    hiddenBar.addEventListener("click", (event) => {
      const chip = event.target.closest(".chip");
      if (!chip) {
        return;
      }
      const panel = byId(chip.dataset.panelId);
      if (panel) {
        panel.hidden = false;
      }
      renderHidden();
      writeState();
    });

    controls.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) {
        return;
      }
      const action = button.dataset.panelAct;
      const preset = button.dataset.panelPreset;
      if (action === "expand") {
        Array.from(panels.children).forEach((panel) => panel.classList.remove("collapsed"));
      }
      if (action === "collapse") {
        Array.from(panels.children).forEach((panel) => panel.classList.add("collapsed"));
      }
      if (action === "reset") {
        localStorage.removeItem(key);
        applyState(defaultState);
        setPreset("");
        return;
      }
      if (preset === "simple") {
        Array.from(panels.children).forEach((panel) => {
          panel.hidden = ["panel-options", "panel-connectors", "panel-help"].includes(panel.id);
          panel.classList.remove("collapsed");
        });
        renderHidden();
        setPreset("simple");
      }
      if (preset === "full") {
        Array.from(panels.children).forEach((panel) => {
          panel.hidden = false;
          panel.classList.remove("collapsed");
        });
        renderHidden();
        setPreset("full");
      }
      writeState();
    });

    let dragged = null;
    function clearDragOver() {
      panels.querySelectorAll(".drag-over").forEach((panel) => panel.classList.remove("drag-over"));
    }

    panels.addEventListener("dragstart", (event) => {
      const head = event.target.closest(".panel-head");
      if (!head) {
        return;
      }
      dragged = head.parentElement;
      dragged.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
    });

    panels.addEventListener("dragend", () => {
      if (dragged) {
        dragged.classList.remove("dragging");
      }
      dragged = null;
      clearDragOver();
      writeState();
    });

    panels.addEventListener("dragover", (event) => {
      event.preventDefault();
      clearDragOver();
      const over = event.target.closest(".panel");
      if (over && over !== dragged && !over.hidden) {
        over.classList.add("drag-over");
      }
    });

    panels.addEventListener("drop", (event) => {
      event.preventDefault();
      const over = event.target.closest(".panel");
      if (over && dragged && over !== dragged) {
        const rect = over.getBoundingClientRect();
        const after = event.clientY - rect.top > rect.height / 2;
        panels.insertBefore(dragged, after ? over.nextSibling : over);
      }
      clearDragOver();
      writeState();
    });

    applyState(readState());
  }

  function render() {
    document.documentElement.lang = lang;
    document.title = config.title || "Calc Square";
    ensureNavStyles();
    document.body.innerHTML = `
      <main class="module-card">
        <nav class="module-nav" aria-label="module navigation">
          <button id="back-to-atlas" type="button">${t.atlas}</button>
          ${categoryLabel() ? `<button id="back-to-category" class="module-category-button" type="button">${categoryLabel()}</button>` : ""}
        </nav>
        <div class="module-title-row">
          <h1>${config.title || "Калькулятор"}</h1>
        </div>
        <div class="module-layout">
          <div class="module-left-column">
            <section class="preview-panel">
              <object class="preview" type="image/svg+xml" data="preview.svg"></object>
              <div class="live-labels" aria-hidden="true">
                ${(config.dimensionKeys || []).map((field, index) => (
                  `<span class="live-label live-label-${index + 1}" data-dim-label="${field.key}">${field.key} = ${field.default}</span>`
                )).join("")}
              </div>
            </section>
            <section class="result-panel">
              <div class="row">${t.area}<b id="area">0.000 ${t.m2}</b></div>
              <div class="row">${t.mass}<b id="mass">0.00 ${t.kg}</b></div>
              <div class="row">${t.specDescription}<b id="desc-line">${config.description || t.note}</b></div>
              ${role === "guest" ? `
                <button id="guest-calculate" type="button">${t.calculate}</button>
                <span id="guest-counter"></span>
              ` : ""}
              ${isAdmin ? `
                <details open>
                  <summary>${t.note}</summary>
                  <p><b>${t.formula}:</b> <span id="formula"></span></p>
                  <p><b>${t.substitution}:</b> <span id="substitution"></span></p>
                </details>
              ` : `
                <span id="formula" hidden></span>
                <span id="substitution" hidden></span>
              `}
              ${canAdd ? `<button id="add-to-project" type="button">${isEdit ? t.saveChanges : t.add}</button>` : ""}
            </section>
          </div>
          <section class="form-panel">
            <div class="panel-controls">
              <button class="ico" data-panel-act="expand" type="button" title="${t.expandAll}">⊞</button>
              <button class="ico" data-panel-act="collapse" type="button" title="${t.collapseAll}">⊟</button>
              <span class="seg">
                <button data-panel-preset="simple" type="button">${t.simpleMode}</button>
                <button data-panel-preset="full" type="button">${t.fullMode}</button>
              </span>
              <button class="ico reset" data-panel-act="reset" type="button" title="${t.resetLayout}">↺</button>
            </div>
            <div class="panels" id="module-panels">
              <div class="panel" id="panel-sizes">
                <div class="panel-head" draggable="true"><span class="drag">⠿</span><span class="caret">▼</span><span class="title">${t.sizes}</span><button class="hide" type="button">✕</button></div>
                <div class="panel-body">
                  ${(config.fields || []).map(renderField).join("")}
                  <label>
                    ${t.qty}
                    <select id="field-Q">
                      ${Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                        `<option value="${value}" ${value === initialNumber("Q", config.quantity || 1) ? "selected" : ""}>${value}</option>`
                      )).join("")}
                    </select>
                  </label>
                </div>
              </div>
              <div class="panel collapsed" id="panel-options">
                <div class="panel-head" draggable="true"><span class="drag">⠿</span><span class="caret">▼</span><span class="title">${t.options}</span><button class="hide" type="button">✕</button></div>
                <div class="panel-body"><p class="tab-empty">${config.description || t.note}</p></div>
              </div>
              <div class="panel" id="panel-detail">
                <div class="panel-head" draggable="true"><span class="drag">⠿</span><span class="caret">▼</span><span class="title">${t.detail}</span><button class="hide" type="button">✕</button></div>
                <div class="panel-body">
                  <label>
                    ${t.material}
                    <select id="material">
                      ${materials.map((item) => `<option value="${item.key}" ${item.key === initialText("materialCode", initialText("material", materials[0].key)) ? "selected" : ""}>${item.label}</option>`).join("")}
                    </select>
                  </label>
                  <label>
                    ${t.thickness}
                    <select id="thickness"></select>
                  </label>
                </div>
              </div>
              <div class="panel collapsed" id="panel-connectors">
                <div class="panel-head" draggable="true"><span class="drag">⠿</span><span class="caret">▼</span><span class="title">${t.connectors}</span><button class="hide" type="button">✕</button></div>
                <div class="panel-body"><p class="tab-empty">${t.connectorPlaceholder}</p></div>
              </div>
              <div class="panel collapsed" id="panel-help">
                <div class="panel-head" draggable="true"><span class="drag">⠿</span><span class="caret">▼</span><span class="title">${t.help}</span><button class="hide" type="button">✕</button></div>
                <div class="panel-body"><p class="help-text">${t.helpText}</p></div>
              </div>
            </div>
            <div class="hidden-bar" id="module-hidden-panels" hidden><span>${t.hidden}:</span></div>
          </section>
        </div>
      </main>
    `;

    renderThicknessOptions();
    initModulePanels();
    byId("back-to-atlas")?.addEventListener("click", () => {
      showAtlas();
    });
    byId("back-to-category")?.addEventListener("click", () => {
      showAtlas(moduleCategory());
    });
    document.querySelectorAll("input, select").forEach((node) => {
      node.addEventListener("input", update);
      node.addEventListener("change", update);
    });
    byId("material").addEventListener("change", () => {
      renderThicknessOptions();
      update();
    });

    byId("guest-calculate")?.addEventListener("click", () => {
      if (consumeGuestCalculation()) {
        update();
      }
    });

    byId("add-to-project")?.addEventListener("click", () => {
      const state = update();
      const item = {
        name: config.itemName || config.title || "Изделие",
        productType: config.productType || "preliminary",
        dimensions: dimensionText(state.values),
        description: config.description || t.note,
        quantity: state.values.Q || 1,
        material: state.material.label,
        materialCode: state.material.key,
        thickness: state.thickness,
        area: state.result.area,
        mass: state.mass
      };
      if (isEdit) {
        item.editIndex = Number(editIndexParam);
      }
      window.parent?.postMessage({ type: "calcSquare:addProjectItem", item }, "*");
    });

    update();
    refreshGuestCounter();
  }

  render();
})();
