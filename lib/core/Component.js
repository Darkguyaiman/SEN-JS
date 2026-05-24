const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const COMPONENTS_DIR = path.join(__dirname, '..', '..', 'components');

/**
 * Sen JS Component System
 *
 * Each component lives in its own folder:
 *   components/{name}/{name}.ejs
 *   components/{name}/{name}.js   (optional)
 *
 * Styling is handled globally via Tailwind CSS.
 */
class ComponentRegistry {
  constructor() {
    this._cache = new Map();
    this._assets = { js: new Set() };
  }

  resetAssets() {
    this._assets = { js: new Set() };
  }

  getAssets() {
    return { js: [...this._assets.js] };
  }

  _resolve(name) {
    if (this._cache.has(name)) return this._cache.get(name);

    const dir = path.join(COMPONENTS_DIR, name);
    const resolved = {
      name,
      dir,
      ejs: path.join(dir, `${name}.ejs`),
      js: path.join(dir, `${name}.js`),
    };

    this._cache.set(name, resolved);
    return resolved;
  }

  _registerAssets(comp) {
    if (fs.existsSync(comp.js)) this._assets.js.add(comp.name);
  }

  render(name, data = {}, locals = {}) {
    const comp = this._resolve(name);

    if (!fs.existsSync(comp.ejs)) {
      throw new Error(`Sen JS component not found: ${name}`);
    }

    this._registerAssets(comp);

    const template = fs.readFileSync(comp.ejs, 'utf8');
    return ejs.render(template, { ...locals, ...data, _sen: { componentName: name } }, {
      filename: comp.ejs,
      root: path.join(__dirname, '..', '..'),
    });
  }

  middleware() {
    const self = this;
    return (req, res, next) => {
      self.resetAssets();

      res.locals.sen = {
        component: (name, data = {}) => self.render(name, data, res.locals),
        assets: () => self.getAssets(),
      };

      next();
    };
  }
}

function renderPage(res, view, data = {}) {
  res.render(`pages/${view}`, data, (err, body) => {
    if (err) return res.status(500).send(err.message);

    res.render('layouts/app', { ...data, body });
  });
}

module.exports = ComponentRegistry;
module.exports.renderPage = renderPage;
module.exports.registry = new ComponentRegistry();
