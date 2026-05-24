# Sen JS

A high-performance admin UI framework for **Express**, **EJS**, **Tailwind CSS**, and **MySQL** — inspired by [Filament PHP](https://filamentphp.com). Build optimized admin panels and internal tools with a maintainable, component-based architecture.

## Philosophy

- **Server-rendered first** — fast initial loads, minimal JavaScript
- **Tailwind CSS** — utility-first styling, no per-component CSS files
- **One folder per component** — each component owns its `.ejs` and optional `.js`
- **Auto JS loading** — scripts are injected only for components used on the page
- **Responsive by default** — tables become cards on mobile

## Quick Start

```bash
npm install
npm run build:css
cp .env.example .env
# Configure MySQL in .env, then:
mysql -u root -p < database/schema.sql
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Without MySQL, the app runs with demo data automatically.

## Project Structure

```
Sen JS/
├── src/input.css          # Tailwind entry file
├── public/assets/sen.css  # Built Tailwind output (generated)
├── components/            # UI components (one folder each)
│   ├── sidebar/
│   │   ├── sidebar.ejs
│   │   └── sidebar.js
│   ├── table/
│   ├── search-bar/
│   ├── filter/
│   ├── calendar/
│   ├── button/
│   ├── header/
│   └── profile/
├── lib/core/Component.js  # Component registry
├── views/
│   ├── layouts/app.ejs
│   └── pages/
├── routes/
├── config/database.js
└── tailwind.config.js
```

## Using Components

```ejs
<%- sen.component('button', { label: 'Save', variant: 'primary' }) %>

<%- sen.component('table', {
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
  ],
  rows: users,
  cardTitle: 'name'
}) %>

<%- sen.component('search-bar', { placeholder: 'Search...', id: 'my-search' }) %>
<%- sen.component('filter', { label: 'Status', name: 'status', options: ['active', 'inactive'] }) %>
<%- sen.component('calendar', { label: 'Date', name: 'date' }) %>
<%- sen.component('calendar', { label: 'Range', range: true }) %>
```

### Available Components

| Component     | Props (key ones)                                      |
|--------------|--------------------------------------------------------|
| `sidebar`    | `items`, `brand`, `user`                               |
| `header`     | `title`, `breadcrumbs`, `user`                         |
| `table`      | `columns`, `rows`, `cardTitle`, `emptyMessage`         |
| `search-bar` | `id`, `placeholder`, `name`, `value`                   |
| `filter`     | `id`, `label`, `name`, `options`, `value`              |
| `calendar`   | `id`, `label`, `name`, `value`, `range`, `min`, `max` |
| `button`     | `label`, `variant`, `size`, `href`, `icon`, `disabled` |
| `profile`    | `user`, `compact`                                      |

### Button Variants

`primary` · `secondary` · `ghost` · `danger`

### Creating a New Component

1. Create `components/my-widget/my-widget.ejs` with Tailwind classes
2. Add optional `my-widget.js` for interactivity
3. Use it: `<%- sen.component('my-widget', { ... }) %>`

If you add new EJS templates, Tailwind will pick them up automatically on rebuild.

## Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Watch Tailwind + run Express server  |
| `npm run build:css` | Build minified Tailwind CSS        |
| `npm run watch:css` | Watch and rebuild Tailwind CSS     |
| `npm start`       | Run Express server only              |

## Rendering Pages

```js
const { renderPage } = require('./lib/core/Component');

router.get('/dashboard', (req, res) => {
  renderPage(res, 'dashboard', {
    title: 'Dashboard',
    nav: [...],
    users: [...],
  });
});
```

## License

MIT
