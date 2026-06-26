# Calc Square Presentation

## Main Links

- Public landing page: `https://vetvvv.github.io/calc-square-camduct-stspetsmontazh-v1/`
- Application in guest mode: `https://vetvvv.github.io/calc-square-camduct-stspetsmontazh-v1/home.html?lang=ru&role=guest`
- Company site: `https://stspecmontag.com.ua/`

## What Opens First

GitHub Pages should open `index.html` from the site root. The landing page is the presentation entry point.

Use `home.html` only as the application page. Landing buttons open it with the selected language and `role=guest`.

## Demo Flow

1. Open the public landing page.
2. Show the atlas/category overview and the contact block.
3. Click "Open Atlas" / "Открыть атлас".
4. Confirm the application opens in guest mode.
5. Open the atlas, choose a product, and show the calculator screen.
6. Open the cabinet only if you need to explain access modes.

## Access Modes

- Guest: atlas and calculators, limited calculator opens.
- User: calculations and adding items to the specification, without editing, saving, printing, or export.
- Client: project/specification workflow, save, print, export, and file open.
- Service: hidden service mode for internal use.

## Before Sharing

- Run `publish.bat`.
- Confirm `Publication checks passed.`
- Open the root URL, not `home.html`.
- Hard-refresh the page if an old build is visible.
