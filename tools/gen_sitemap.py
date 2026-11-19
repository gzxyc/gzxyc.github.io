# -*- coding: utf-8 -*-
"""
从 content/ 自动生成 sitemap.xml 与 robots.txt。
用法：
  python tools/gen_sitemap.py https://你的域名/        # 指定站点根地址
  python tools/gen_sitemap.py                          # 不带参数时读 site.json 的 url 字段，没有则用占位

商品页/指南页为参数化地址，一并写入（低优先级）。
"""
import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CDIR = os.path.join(ROOT, 'content')

base = sys.argv[1] if len(sys.argv) > 1 else None
if not base:
    try:
        base = json.load(open(os.path.join(CDIR, 'site.json'), encoding='utf-8')).get('url')
    except Exception:
        base = None
if not base:
    base = 'https://gzxyc.github.io/'
if not base.endswith('/'):
    base += '/'

products = json.load(open(os.path.join(CDIR, 'products.json'), encoding='utf-8'))
guides = json.load(open(os.path.join(CDIR, 'guides.json'), encoding='utf-8'))

urls = [(base, '1.0'), (base + 'category.html', '0.9'),
        (base + 'search.html', '0.5'), (base + 'guides.html', '0.8'),
        (base + 'about.html', '0.5')]
for g in guides:
    urls.append((base + 'guide.html?g=' + g['id'], '0.7'))
for p in products:
    urls.append((base + 'product.html?p=' + p['id'], '0.6'))

lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<!-- 自动生成：python tools/gen_sitemap.py  |  换域名时带新地址重跑 -->',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u, pr in urls:
    lines.append('  <url><loc>%s</loc><priority>%s</priority></url>' % (u, pr))
lines.append('</urlset>')
open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')

open(os.path.join(ROOT, 'robots.txt'), 'w', encoding='utf-8').write(
    'User-agent: *\nAllow: /\n\nSitemap: ' + base + 'sitemap.xml\n')
print('sitemap.xml 生成：%d 条地址（基地址 %s）' % (len(urls), base))
print('robots.txt 已同步 Sitemap 地址')
