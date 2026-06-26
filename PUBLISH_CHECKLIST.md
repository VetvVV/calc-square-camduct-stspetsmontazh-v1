# Calc Square Publish Checklist

Use this checklist before publishing changes to GitHub Pages. A full pass is needed after changes in `index.html`, `home.html`, atlas, roles, localization, specification tables, saved-file import, or calculator logic. For text-only changes, run the automatic validation and do a quick visual check.

## Automatic Checks

- Run `publish.bat`.
- Confirm `Publication checks passed.`
- Confirm `catalog localization ok` is printed.
- Confirm `ui localization ok` is printed.
- Confirm `materials ok` is printed.
- Confirm `catalog assets ok` is printed.
- Confirm `catalog modules ok` is printed.
- Confirm `catalog keys ok` is printed.
- Confirm `role matrix ok` is printed.
- Confirm `local fonts ok` is printed.
- Confirm `dev traces ok` is printed, or review any development trace warnings.
- Confirm landing metadata, sitemap, robots, and 404 checks pass through the validator.
- Confirm the build label changed in the console.
- Confirm the automatic commit message lists the expected files.

## Quick Visual Smoke Test

- Open `index.html` locally.
- Confirm the landing page opens first.
- Confirm the top buttons read as atlas/catalog/contact actions, not calculator preview or access actions.
- Open the application from the landing page.
- Confirm the application opens in guest mode.
- Check that the top header, project/specification area, splitter, and atlas are visible.
- Open the atlas and click one round calculator.
- Open one rectangular calculator.
- Return to atlas from the calculator.
- Confirm no product atlas is blank.

## Mobile Smoke Test

- Check the landing page around 390 px viewport width.
- Confirm the header, language selector, and "Open Atlas" button do not overlap.
- Confirm the landing page has no horizontal scroll.
- Open the application from the mobile landing page.
- Confirm guest mode opens with only "Home" and "Atlas" visible in the top navigation.

## Roles

- Guest: atlas opens; calculator opens count down from 5; the sixth calculator open is blocked.
- Guest: project/specification actions are unavailable.
- User: calculators work and products can be added to the specification.
- User: edit, delete, save, print, export, Excel, and open file are blocked or read-only.
- Client: add, edit, delete, save, print, export, Excel, and open file work.
- Client: formulas are hidden.
- Admin: formulas and service details are visible.
- "Guest mode" returns the application to guest mode.

## Specification

- Add at least one round and one rectangular product.
- Check row count, total area, total mass, and material summary.
- Check comment editing.
- Check row edit and delete controls for allowed roles.
- Check column filters for number, name, dimensions, quantity, material, and thickness.
- Check column drag order and column width resize.
- Check "Dimensions under name" and "Dimensions" column modes.
- Check pinned and unpinned material summary behavior.

## Localization

- Switch RU, UK, and EN.
- Confirm atlas titles, specification headers, controls, buttons, and calculator panel labels change language.
- Open a saved specification and switch language again.
- Confirm product names and material names follow the selected language.

## Saved Files

- Save a project file as client or admin.
- Open that file again.
- Confirm rows, comments, totals, project name, customer, and object are restored.
- Confirm old saved files normalize names/materials into the current language where possible.

## Publishing

- Press Enter in `publish.bat` only after the generated commit message looks correct.
- After GitHub Pages opens, confirm the URL is the site root, not `home.html`.
- Hard-refresh once if the old page is still visible.
- Confirm the atlas build label in the lower-right corner matches the new build label.
