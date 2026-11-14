# Form Fatigue Fix

A one-page fill order for official forms, starting with two public Toronto-area PDFs.

Government forms often mix required lines, optional boxes, and office-use fields on the same page. Form Fatigue Fix loads a field list taken from the published form, marks what the form says you must complete, and prints a calm step order. You can keep a photo of your own copy on screen for reference. The photo never leaves your device, and the page does not try to read it.

Built for IdeaLab Hacks (solo entry by John Khan, Toronto, Ontario). All code was written during the event.

Live demo: https://alenzacodes.github.io/form-fatigue-fix/

## Features

- Two official samples: the City of Toronto Freedom of Information Access Request (form 07-0088 2023-01) and Landlord and Tenant Board Form N9 (v. 01/04/2022)
- Five labels: required, worth filling though not marked required, only if it applies, optional, and office use
- A numbered fill order you can copy
- Optional local reference photo
- No accounts and no invented fields

## Run locally

From this folder:

```bash
python3 -m http.server 8080 --directory site
```

Open http://localhost:8080/.

## Tests

```bash
node tests/test_forms.mjs
```

## Data sources

- City of Toronto FOI form: https://www.toronto.ca/wp-content/uploads/2024/08/976e-FOIRequestForm2023FINAL.pdf
- City FOI guide: https://www.toronto.ca/city-government/accountability-operations-customer-service/access-city-information-or-records/freedom-of-information/
- Tribunals Ontario Form N9: https://tribunalsontario.ca/documents/ltb/Notices%20of%20Termination%20%26%20Instructions/N9.pdf

Links were checked on 9 and 13 November 2026, America/Toronto, and returned HTTP 200.

## Deploy

A GitHub Actions workflow in `.github/workflows/pages.yml` runs the tests and publishes `site/` to GitHub Pages on every push to `main`.

## Stack

HTML, CSS and JavaScript. No build step. Deep blue `#011F5B` and deep red `#990000` on white.

## License

MIT. See `LICENSE`.
