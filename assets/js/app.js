/* ==========================================================================
   China Shenzhen Huaqiangbei Electronics — 全站脚本
   纯原生 JavaScript，无框架、无构建步骤。内容全部来自 content/ 目录 JSON。
   站点名称、追踪链接模板一律读 site.json，不在代码里写死。
   ========================================================================== */
(function () {
  'use strict';

  var DATA = {
    site: 'content/site.json',
    categories: 'content/categories.json',
    products: 'content/products.json',
    guides: 'content/guides.json'
  };
  var state = { site: null, categories: [], products: [], guides: [] };
  var THEME_KEY = 'hqb-electronics-theme';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function money(n) { return '$' + Number(n).toFixed(2); }
  function fmtCount(n) {
    n = Number(n) || 0;
    return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
  }
  function discount(p) {
    return p.compareAt > p.price ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
  }
  function stars(r) {
    var full = Math.round(r);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  /* ---------------- 明暗主题 ---------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    var btn = $('#theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '\u2600' : '\u263D';
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#16110f' : '#fbf8f6');
  }
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    applyTheme(saved || 'light');
  }
  function bindThemeToggle() {
    var btn = $('#theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---------------- 追踪链接（双层：商品专属短链 > 站点模板） ---------------- */
  function affiliateUrl(p) {
    var aff = state.site.affiliate || {};
    if (p.affLink && /^https?:\/\//i.test(p.affLink)) return p.affLink;
    var tpl = aff.linkTemplate || 'https://www.aliexpress.com/item/{id}.html?tracking_id={tid}';
    return tpl
      .replace(/\{id\}/g, encodeURIComponent(p.aliId || p.id))
      .replace(/\{tid\}/g, encodeURIComponent(aff.trackingId || ''));
  }
  function dealAttrs() {
    return ' target="_blank" rel="sponsored noopener noreferrer"';
  }

  /* ---------------- 图片：外链优先，失败切本地兜底 ---------------- */
  function imgTag(p, cls) {
    var src = (p.image && /^https?:\/\//i.test(p.image)) ? p.image : (p.fallback || '');
    var fb = p.fallback || '';
    return '<img' + (cls ? ' class="' + cls + '"' : '') +
      ' src="' + esc(src) + '" data-fb="' + esc(fb) + '"' +
      ' alt="' + esc(p.name) + '" loading="lazy"' +
      ' onerror="this.onerror=null;if(this.dataset.fb&&this.src.indexOf(this.dataset.fb)<0){this.src=this.dataset.fb}">';
  }

  /* ---------------- 通用组件 ---------------- */
  function brandHTML() {
    var s = state.site;
    /* 品牌完整英文名为 China Shenzhen Huaqiangbei Electronics：
       页头用「CHINA · SHENZHEN」小字压在 Huaqiangbei Electronics 上方，
       既完整保留地名层级，又不让导航被超长站名挤爆。 */
    var eyebrow = s.brandEyebrow ? '<span class="brand-eyebrow">' + esc(s.brandEyebrow) + '</span>' : '';
    return '<a class="brand" href="index.html"><span class="brand-mark">' + esc(s.brandMark || 'H') + '</span>' +
      '<span class="brand-wordmark">' + eyebrow +
        esc(s.brandMain || s.name) + ' <span class="brand-accent">' + esc(s.brandAccent || '') + '</span>' +
      '</span></a>';
  }
  function searchForm(value, big) {
    return '<form class="search-form' + (big ? ' search-big' : '') + '" action="search.html" method="get">' +
      '<input type="search" name="q" value="' + esc(value || '') + '" placeholder="Search 120 products — earbuds, watches, power banks..." aria-label="Search products">' +
      '<button type="submit" aria-label="Search">\u26B2</button></form>';
  }
  function renderHeader() {
    var s = state.site;
    var nav = (s.nav || []).map(function (n) {
      var active = n.url !== 'index.html' && n.url.indexOf('#') < 0 && location.pathname.indexOf(n.url) > -1;
      return '<a href="' + esc(n.url) + '"' + (active ? ' class="active"' : '') + '>' + esc(n.label) + '</a>';
    }).join('');
    var host = $('#site-header');
    if (!host) return;
    host.innerHTML =
      '<div class="wrap header-inner">' + brandHTML() +
        '<nav class="nav" id="nav">' + nav + '</nav>' +
        '<div class="header-search">' + searchForm('', false) + '</div>' +
        '<button class="menu-btn theme-toggle" id="menu-btn" aria-label="Menu">\u2261</button>' +
        '<button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">\u263D</button>' +
      '</div>';
    var menuBtn = $('#menu-btn');
    if (menuBtn) menuBtn.addEventListener('click', function () { $('#nav').classList.toggle('open'); });
    bindThemeToggle();
    applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
  }
  function renderFooter() {
    var s = state.site;
    var links = (s.footerLinks || []).map(function (l) {
      return '<a href="' + esc(l.url) + '">' + esc(l.label) + '</a>';
    }).join('');
    var host = $('#site-footer');
    if (!host) return;
    host.innerHTML =
      '<div class="wrap">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' + brandHTML() +
            '<p>' + esc(s.tagline || '') + '</p>' +
            (s.nameZh ? '<p class="footer-zh">' + esc(s.nameZh) + '</p>' : '') + '</div>' +
          '<div class="footer-links">' + links + '</div>' +
        '</div>' +
        '<p class="footer-disclosure">' + esc((s.affiliate || {}).disclosure || '') + '</p>' +
        '<div class="footer-bottom">' +
          '<span>&copy; ' + new Date().getFullYear() + ' ' + esc(s.copyright || s.name || '') + '</span>' +
          '<span>Factory-direct from Huaqiangbei, Shenzhen</span>' +
        '</div>' +
      '</div>';
  }
  function setMeta() {
    var s = state.site;
    var d = $('meta[name="description"]');
    if (d && s.description) d.setAttribute('content', s.description);
  }
  function catName(id) {
    var c = state.categories.filter(function (x) { return x.id === id; })[0];
    return c ? c.name : id;
  }
  function catIcon(kind, color) {
    var paths = {
      earbuds: '<path d="M7 8a4 4 0 0 1 4 4v5a2 2 0 0 1-4 0zM17 8a4 4 0 0 0-4 4v5a2 2 0 0 0 4 0z" fill="' + color + '"/>',
      watch: '<rect x="7" y="6" width="10" height="12" rx="3" fill="' + color + '"/><rect x="9" y="2" width="6" height="4" fill="' + color + '"/><rect x="9" y="18" width="6" height="4" fill="' + color + '"/>',
      battery: '<rect x="5" y="7" width="14" height="10" rx="2" fill="' + color + '"/><rect x="19" y="10" width="2" height="4" fill="' + color + '"/>',
      case: '<rect x="7" y="3" width="10" height="18" rx="2" fill="none" stroke="' + color + '" stroke-width="2.5"/><rect x="9" y="5" width="6" height="5" rx="1" fill="' + color + '"/>',
      charger: '<rect x="7" y="7" width="10" height="10" rx="2" fill="' + color + '"/><path d="M10 4v3M14 4v3M10 17v3M14 17v3" stroke="' + color + '" stroke-width="2"/>',
      keyboard: '<rect x="3" y="7" width="18" height="10" rx="2" fill="' + color + '"/><g fill="#fff"><rect x="5" y="9" width="2" height="2"/><rect x="9" y="9" width="2" height="2"/><rect x="13" y="9" width="2" height="2"/><rect x="17" y="9" width="2" height="2"/><rect x="5" y="13" width="2" height="2"/><rect x="9" y="13" width="8" height="2"/></g>',
      speaker: '<rect x="6" y="3" width="12" height="18" rx="3" fill="' + color + '"/><circle cx="12" cy="14" r="3.5" fill="#fff" opacity=".8"/><circle cx="12" cy="7" r="1.6" fill="#fff" opacity=".8"/>',
      home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="' + color + '"/>',
      car: '<path d="M4 15l2-6h12l2 6v3H4z" fill="' + color + '"/><circle cx="7" cy="18" r="1.6" fill="#fff"/><circle cx="17" cy="18" r="1.6" fill="#fff"/>',
      gaming: '<path d="M7 8h10a4 4 0 0 1 3 6l-1 4-3-2H8l-3 2-1-4a4 4 0 0 1 3-6z" fill="' + color + '"/>',
      fitness: '<circle cx="12" cy="12" r="8" fill="none" stroke="' + color + '" stroke-width="2.5"/><path d="M8 12l3 3 5-6" stroke="' + color + '" stroke-width="2" fill="none"/>',
      gadget: '<rect x="4" y="6" width="16" height="12" rx="2" fill="' + color + '"/><circle cx="12" cy="12" r="3" fill="#fff" opacity=".85"/>'
    };
    return '<span class="cat-icon" style="background:' + color + '1f">' +
      '<svg viewBox="0 0 24 24">' + (paths[kind] || paths.gadget) + '</svg></span>';
  }

  /* ---------------- 商品卡片（成交强化：折扣/销量/评分/划线价） ---------------- */
  function productCard(p) {
    var off = discount(p);
    return '<article class="product-card">' +
      '<div class="product-media">' +
        '<a href="product.html?p=' + encodeURIComponent(p.id) + '" aria-label="' + esc(p.name) + '">' + imgTag(p) + '</a>' +
        (off ? '<span class="discount-tag">-' + off + '%</span>' : '') +
        (p.badge ? '<span class="badge">' + esc(p.badge) + '</span>' : '') +
      '</div>' +
      '<div class="product-body">' +
        '<span class="product-cat">' + esc(catName(p.category)) + '</span>' +
        '<h3 class="product-name"><a href="product.html?p=' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a></h3>' +
        '<div class="product-rating"><span class="stars">' + stars(p.rating) + '</span> ' + p.rating.toFixed(1) +
          ' <span class="rev">(' + fmtCount(p.reviews) + ')</span></div>' +
        '<div class="sold-line">\u25cf ' + fmtCount(p.orders) + ' sold last month</div>' +
        '<div class="product-foot">' +
          '<div class="price-wrap"><span class="price">' + money(p.price) + '</span>' +
            (off ? ' <s>' + money(p.compareAt) + '</s>' : '') + '</div>' +
          '<a class="btn-buy" href="' + esc(affiliateUrl(p)) + '"' + dealAttrs() + '>View deal \u2192</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function guideCard(g) {
    return '<article class="guide-card">' +
      '<a href="guide.html?g=' + encodeURIComponent(g.id) + '"><img src="' + esc(g.image) + '" alt="' + esc(g.title) + '" loading="lazy"></a>' +
      '<div class="guide-card-body">' +
        '<div class="guide-meta">' + esc(catName(g.category)) + ' \u00b7 ' + esc(g.readTime) + ' read</div>' +
        '<h3><a href="guide.html?g=' + encodeURIComponent(g.id) + '">' + esc(g.title) + '</a></h3>' +
        '<p>' + esc(g.excerpt) + '</p>' +
      '</div></article>';
  }

  /* ---------------- 排序与搜索 ---------------- */
  function sortProducts(list, sort) {
    var a = list.slice();
    if (sort === 'price-asc') a.sort(function (x, y) { return x.price - y.price; });
    else if (sort === 'price-desc') a.sort(function (x, y) { return y.price - x.price; });
    else if (sort === 'rating') a.sort(function (x, y) { return y.rating - x.rating || y.reviews - x.reviews; });
    else if (sort === 'orders') a.sort(function (x, y) { return y.orders - x.orders; });
    else if (sort === 'discount') a.sort(function (x, y) { return discount(y) - discount(x); });
    return a;
  }
  function searchProducts(q) {
    q = (q || '').trim().toLowerCase();
    if (!q) return state.products;
    var words = q.split(/\s+/);
    return state.products.filter(function (p) {
      var hay = [p.name, p.tagline, catName(p.category), (p.tags || []).join(' '),
        Object.keys(p.specs || {}).map(function (k) { return k + ' ' + p.specs[k]; }).join(' ')]
        .join(' ').toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    });
  }
  function sortSelect(current, extra) {
    var opts = [
      ['', 'Best match'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'],
      ['discount', 'Biggest discount'], ['rating', 'Top rated'], ['orders', 'Best selling']
    ];
    return '<label class="sort-wrap">Sort by <select id="sort-select">' + opts.map(function (o) {
      return '<option value="' + o[0] + '"' + (current === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
    }).join('') + '</select></label>' + (extra || '');
  }
  function bindSort(baseParams) {
    var sel = $('#sort-select');
    if (!sel) return;
    sel.addEventListener('change', function () {
      var p = new URLSearchParams(baseParams);
      if (sel.value) p.set('sort', sel.value); else p.delete('sort');
      var q = p.toString();
      location.href = location.pathname + (q ? '?' + q : '');
    });
  }

  /* ---------------- 首页 ---------------- */
  function renderHome() {
    var s = state.site;
    document.title = s.name + ' — ' + s.tagline;
    var cats = state.categories.map(function (c) {
      return '<a class="cat-card" href="category.html?c=' + encodeURIComponent(c.id) + '">' +
        catIcon(c.icon, c.color) + '<h3>' + esc(c.short) + '</h3><p>' + esc(c.description) + '</p></a>';
    }).join('');
    var points = (s.sellingPoints || []).map(function (sp) {
      return '<div class="point"><div class="point-ico">' +
        (sp.icon === 'source' ? '\u2302' : sp.icon === 'value' ? '\u25C6' : '\u270E') +
        '</div><h4>' + esc(sp.title) + '</h4><p>' + esc(sp.text) + '</p></div>';
    }).join('');
    var deals = sortProducts(state.products, 'discount').slice(0, 8);
    var best = sortProducts(state.products, 'orders').slice(0, 8);
    var guides = state.guides.slice(0, 3);

    $('#app').innerHTML =
      '<header class="site-header" id="site-header"></header>' +
      '<main>' +
        '<section class="hero"><div class="wrap hero-inner">' +
          '<div class="hero-copy">' +
            '<span class="hero-flag">HUAQIANGBEI \u00b7 SHENZHEN \u00b7 FACTORY DIRECT</span>' +
            '<h1>Shenzhen tech.<br><em>Straight from the source.</em></h1>' +
            '<p>' + esc(s.description) + '</p>' +
            '<div class="hero-actions">' +
              '<a class="btn btn-primary" href="category.html">Shop all products \u2192</a>' +
              '<a class="btn btn-ghost" href="guides.html">Buying guides</a>' +
            '</div>' +
            '<div class="hero-stats"><div><strong>120+</strong><span>hand-picked products</span></div>' +
              '<div><strong>12</strong><span>popular categories</span></div>' +
              '<div><strong>Up to 80%</strong><span>below retail</span></div></div>' +
          '</div>' +
          '<div class="hero-side">' + searchForm('', true) +
            '<div class="hero-cats">' + state.categories.slice(0, 6).map(function (c) {
              return '<a href="category.html?c=' + encodeURIComponent(c.id) + '">' +
                catIcon(c.icon, c.color) + '<span>' + esc(c.short) + '</span></a>';
            }).join('') + '</div>' +
          '</div>' +
        '</div></section>' +

        '<section class="section points"><div class="wrap"><div class="points-grid">' + points + '</div></div></section>' +

        '<section class="section"><div class="wrap">' +
          '<div class="section-head"><div><h2>Shop by category</h2><p>' + state.products.length +
            ' products across ' + state.categories.length + ' categories — all factory-direct.</p></div>' +
            '<a class="link-more" href="category.html">View all \u2192</a></div>' +
          '<div class="cat-grid">' + cats + '</div></div></section>' +

        '<section class="section band"><div class="wrap">' +
          '<div class="section-head"><div><h2>Biggest discounts right now</h2><p>The widest gaps between source price and retail.</p></div>' +
            '<a class="link-more" href="category.html?sort=discount">See all deals \u2192</a></div>' +
          '<div class="product-grid">' + deals.map(productCard).join('') + '</div></div></section>' +

        '<section class="section"><div class="wrap">' +
          '<div class="section-head"><div><h2>Best sellers this month</h2><p>What buyers are actually ordering right now.</p></div>' +
            '<a class="link-more" href="category.html?sort=orders">See all \u2192</a></div>' +
          '<div class="product-grid">' + best.map(productCard).join('') + '</div></div></section>' +

        '<section class="section band"><div class="wrap">' +
          '<div class="section-head"><div><h2>Buying guides</h2><p>Know what to look for before you buy.</p></div>' +
            '<a class="link-more" href="guides.html">All guides \u2192</a></div>' +
          '<div class="guide-grid">' + guides.map(guideCard).join('') + '</div></div></section>' +

        '<section class="section"><div class="wrap"><div class="cta-strip">' +
          '<div><h3>Why pay retail?</h3><p>Every link on this site goes straight to the source. You get factory prices; we earn a small commission — at no extra cost to you.</p></div>' +
          '<a class="btn btn-primary" href="category.html">Start shopping \u2192</a>' +
        '</div></div></section>' +
      '</main><footer class="site-footer" id="site-footer"></footer>';
    renderHeader(); renderFooter();
  }

  /* ---------------- 商品列表（分类 / 搜索共用） ---------------- */
  function renderListing(mode) {
    var params = new URLSearchParams(location.search);
    var sort = params.get('sort') || '';
    var cat = params.get('c') || 'all';
    var q = params.get('q') || '';
    var isSearch = mode === 'search';

    var list = isSearch ? searchProducts(q)
      : (cat === 'all' ? state.products : state.products.filter(function (p) { return p.category === cat; }));
    list = sortProducts(list, sort);

    document.title = (isSearch ? ('Search: ' + (q || 'all products')) :
      (cat === 'all' ? 'All products' : catName(cat))) + ' — ' + state.site.name;

    var chips = '';
    if (!isSearch) {
      chips = '<button class="filter-chip' + (cat === 'all' ? ' active' : '') + '" data-c="all">All (' + state.products.length + ')</button>' +
        state.categories.map(function (c) {
          var n = state.products.filter(function (p) { return p.category === c.id; }).length;
          return '<button class="filter-chip' + (cat === c.id ? ' active' : '') + '" data-c="' + esc(c.id) + '">' +
            esc(c.short) + ' (' + n + ')</button>';
        }).join('');
    }

    var baseParams = isSearch ? (q ? 'q=' + encodeURIComponent(q) : '') : (cat === 'all' ? '' : 'c=' + encodeURIComponent(cat));
    $('#app').innerHTML =
      '<header class="site-header" id="site-header"></header><main>' +
        '<div class="page-head"><div class="wrap">' +
          (isSearch
            ? '<h1>Search products</h1>' + searchForm(q, true) +
              '<p class="result-line">' + list.length + ' result' + (list.length === 1 ? '' : 's') +
              (q ? ' for <strong>' + esc(q) + '</strong>' : '') + '</p>'
            : '<h1>' + (cat === 'all' ? 'All products' : esc(catName(cat))) + '</h1>' +
              '<p>' + list.length + ' factory-direct products. Compare specs, ratings and monthly orders — then buy at the source price.</p>') +
        '</div></div>' +
        '<section class="section"><div class="wrap">' +
          (chips ? '<div class="filter-bar" id="filters">' + chips + '</div>' : '') +
          '<div class="list-toolbar">' + sortSelect(sort, '<span class="list-count">' + list.length + ' products</span>') + '</div>' +
          (list.length
            ? '<div class="product-grid">' + list.map(productCard).join('') + '</div>'
            : '<div class="empty-state"><span class="big">0</span>No products found. Try a different search term.</div>') +
        '</div></section>' +
      '</main><footer class="site-footer" id="site-footer"></footer>';
    renderHeader(); renderFooter();
    bindSort(baseParams);
    $$('#filters .filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var c = chip.getAttribute('data-c');
        var p = new URLSearchParams();
        if (c !== 'all') p.set('c', c);
        if (sort) p.set('sort', sort);
        var s = p.toString();
        location.href = 'category.html' + (s ? '?' + s : '');
      });
    });
  }
  function renderCategory() { renderListing('category'); }
  function renderSearch() { renderListing('search'); }

  /* ---------------- 商品详情（成交重点页） ---------------- */
  function renderProduct() {
    var id = new URLSearchParams(location.search).get('p');
    var p = state.products.filter(function (x) { return x.id === id; })[0];
    if (!p) {
      $('#app').innerHTML = '<header class="site-header" id="site-header"></header><main><div class="empty-state"><span class="big">404</span>Product not found.</div></main><footer class="site-footer" id="site-footer"></footer>';
      renderHeader(); renderFooter(); return;
    }
    document.title = p.name + ' — ' + state.site.name;
    var off = discount(p);
    var pros = p.pros.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    var cons = p.cons.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    var specs = Object.keys(p.specs || {}).map(function (k) {
      return '<tr><td>' + esc(k) + '</td><td>' + esc(p.specs[k]) + '</td></tr>';
    }).join('');
    var related = sortProducts(state.products.filter(function (x) {
      return x.category === p.category && x.id !== p.id;
    }), 'orders').slice(0, 4);
    var url = esc(affiliateUrl(p));

    $('#app').innerHTML =
      '<header class="site-header" id="site-header"></header><main>' +
        '<div class="wrap crumb"><a href="category.html?c=' + encodeURIComponent(p.category) + '">\u2190 ' + esc(catName(p.category)) + '</a>' +
          '<span> / </span><span>' + esc(p.name) + '</span></div>' +
        '<div class="wrap detail-grid">' +
          '<div class="detail-media">' + imgTag(p, 'detail-img') +
            '<div class="media-tags">' + (off ? '<span class="discount-tag">-' + off + '% OFF</span>' : '') +
            (p.badge ? '<span class="badge">' + esc(p.badge) + '</span>' : '') + '</div></div>' +
          '<div class="detail-info">' +
            '<span class="product-cat">' + esc(catName(p.category)) + ' \u00b7 HUAQIANGBEI DIRECT</span>' +
            '<h1>' + esc(p.name) + '</h1>' +
            '<p class="detail-tagline">' + esc(p.tagline) + '</p>' +
            '<div class="detail-meta"><span class="stars">' + stars(p.rating) + '</span>' +
              '<strong>' + p.rating.toFixed(1) + '</strong><span>' + fmtCount(p.reviews) + ' ratings</span>' +
              '<span class="dot">\u00b7</span><span class="sold-strong">' + fmtCount(p.orders) + ' sold last month</span></div>' +
            '<div class="price-box">' +
              '<div class="price-row"><span class="detail-price">' + money(p.price) + '</span>' +
                (off ? '<s>' + money(p.compareAt) + '</s><span class="save-pill">Save ' + off + '%</span>' : '') + '</div>' +
              '<div class="price-note">Factory-direct price \u00b7 Retail comparison ' + (off ? money(p.compareAt) : 'n/a') + '</div>' +
            '</div>' +
            '<a class="btn btn-primary btn-lg" href="' + url + '"' + dealAttrs() + '>Check price on AliExpress \u2192</a>' +
            '<div class="trust-row"><span>\u2713 Secure checkout on AliExpress</span><span>\u2713 Ships worldwide</span><span>\u2713 No markup from us</span></div>' +
            '<p class="disclosure-mini">' + esc((state.site.affiliate || {}).disclosure || '') + '</p>' +
            '<div class="pros-cons"><div class="pc-box pros"><h4>What we like</h4><ul>' + pros + '</ul></div>' +
              '<div class="pc-box cons"><h4>Watch out for</h4><ul>' + cons + '</ul></div></div>' +
            '<div class="verdict"><h4>Our verdict</h4><p>' + esc(p.verdict) + '</p></div>' +
            '<h4 class="spec-title">Specifications</h4>' +
            '<table class="spec-table"><tbody>' + specs + '</tbody></table>' +
            '<a class="btn btn-outline btn-lg" href="' + url + '"' + dealAttrs() + '>Get this deal \u2192</a>' +
          '</div>' +
        '</div>' +
        (related.length ? '<section class="section band"><div class="wrap">' +
          '<div class="section-head"><h2>More in ' + esc(catName(p.category)) + '</h2></div>' +
          '<div class="product-grid">' + related.map(productCard).join('') + '</div></div></section>' : '') +
      '</main><footer class="site-footer" id="site-footer"></footer>';
    renderHeader(); renderFooter();
  }

  /* ---------------- 指南列表 / 正文 ---------------- */
  function renderGuides() {
    document.title = 'Buying guides — ' + state.site.name;
    $('#app').innerHTML =
      '<header class="site-header" id="site-header"></header><main>' +
        '<div class="page-head"><div class="wrap"><h1>Buying guides</h1>' +
          '<p>Practical, no-fluff advice so you know exactly what to look for — and what not to pay for.</p></div></div>' +
        '<section class="section"><div class="wrap"><div class="guide-grid">' +
          state.guides.map(guideCard).join('') + '</div></div></section>' +
      '</main><footer class="site-footer" id="site-footer"></footer>';
    renderHeader(); renderFooter();
  }
  function renderGuide() {
    var id = new URLSearchParams(location.search).get('g');
    var g = state.guides.filter(function (x) { return x.id === id; })[0];
    if (!g) {
      $('#app').innerHTML = '<header class="site-header" id="site-header"></header><main><div class="empty-state"><span class="big">404</span>Guide not found.</div></main><footer class="site-footer" id="site-footer"></footer>';
      renderHeader(); renderFooter(); return;
    }
    document.title = g.title + ' — ' + state.site.name;
    var body = (g.body || []).map(function (b) {
      if (b.type === 'h2') return '<h2>' + esc(b.text) + '</h2>';
      if (b.type === 'callout') return '<div class="callout">' + esc(b.text) + '</div>';
      return '<p>' + esc(b.text) + '</p>';
    }).join('');
    var picks = sortProducts(state.products.filter(function (p) { return p.category === g.category; }), 'orders').slice(0, 3);
    $('#app').innerHTML =
      '<header class="site-header" id="site-header"></header><main><article class="article">' +
        '<a class="link-more" href="guides.html">\u2190 All guides</a>' +
        '<h1 style="margin-top:20px">' + esc(g.title) + '</h1>' +
        '<div class="article-meta">' + esc(g.date) + ' \u00b7 ' + esc(g.readTime) + ' read \u00b7 ' + esc(catName(g.category)) + '</div>' +
        '<img class="cover" src="' + esc(g.image) + '" alt="' + esc(g.title) + '">' +
        '<div class="article-body">' + body + '</div>' +
        (picks.length ? '<section class="guide-picks"><h2>Our picks in ' + esc(catName(g.category)) + '</h2>' +
          '<div class="product-grid">' + picks.map(productCard).join('') + '</div></section>' : '') +
      '</article></main><footer class="site-footer" id="site-footer"></footer>';
    renderHeader(); renderFooter();
  }

  /* ---------------- 关于页 ---------------- */
  function renderAbout() {
    document.title = 'About — ' + state.site.name;
    var s = state.site;
    $('#app').innerHTML =
      '<header class="site-header" id="site-header"></header><main><div class="about">' +
        '<h1>About ' + esc(s.name) + '</h1>' +
        '<p>We are an independent site focused on electronics from Huaqiangbei — the sprawling market in Shenzhen where much of the world\'s consumer tech is made and traded. Our job is simple: find the products with the best feature-per-dollar, compare them honestly, and link you straight to the source.</p>' +
        '<h2>How we make money</h2>' +
        '<p>Shopping links on this site are affiliate links. If you buy through them, we earn a small commission from AliExpress at no extra cost to you. This is what keeps the site running and the picks independent — we never charge a seller for a place on this site.</p>' +
        '<div class="disclosure-box" id="disclosure"><h4 style="margin:0 0 8px;font-size:14px">Affiliate disclosure</h4>' +
          '<p style="font-size:14px;margin:0">' + esc((s.affiliate || {}).disclosure || '') + '</p></div>' +
        '<h2>How we pick products</h2>' +
        '<p>We look at verifiable specs (chipsets, battery capacity, driver size), recent order volume, and real-world value — not just ratings. Listings that hide their specs get passed over. We list monthly orders next to ratings because a high score on a handful of reviews tells you very little.</p>' +
        '<h2>A note on prices</h2>' +
        '<p>Prices and stock change constantly on marketplaces. The price shown is a reference captured at the time of writing; always check the live price on the product page before buying. Products vary by plug type and shipping destination — confirm those details at checkout.</p>' +
        '<h2 id="contact">Contact</h2>' +
        '<p>Questions, corrections or suggestions? Email <a style="color:var(--accent)" href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a>.</p>' +
      '</div></main><footer class="site-footer" id="site-footer"></footer>';
    renderHeader(); renderFooter();
  }

  /* ---------------- 启动 ---------------- */
  function loadJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('Failed to load ' + url);
      return r.json();
    });
  }
  function boot() {
    initTheme();
    Promise.all([loadJSON(DATA.site), loadJSON(DATA.categories),
      loadJSON(DATA.products), loadJSON(DATA.guides)]).then(function (res) {
      state.site = res[0]; state.categories = res[1];
      state.products = res[2]; state.guides = res[3];
      setMeta();
      var page = document.body.dataset.page || 'home';
      var routes = {
        home: renderHome, category: renderCategory, search: renderSearch,
        product: renderProduct, guides: renderGuides, guide: renderGuide, about: renderAbout
      };
      (routes[page] || renderHome)();
    }).catch(function (err) {
      console.error('[HQB Electronics] Content failed to load:', err);
      $('#app').innerHTML = '<div class="empty-state"><span class="big">!</span>Unable to load content. Please try again.</div>';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
