/* 生成真实联网新闻 / 博客数据
 * 运行：node scripts/build-feeds.js
 * 输出：data/news.json, data/blog.json, data/hot.json
 * 数据源：公开 RSS（时政/财经/消费） + 苹果播客 iTunes RSS（博客精选）
 * 说明：抖音无公开 API，爆款二创（hot.json）保留为精选合集占位，由人工维护。
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

function get(url, ms = 22000) {
  // 统一走 https；若源是 http，多数服务器支持 https
  if (url.startsWith('http://')) url = 'https://' + url.slice(7);
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: { 'User-Agent': UA, 'Accept': '*/*' },
      timeout: ms
    }, (res) => {
      // 跟随重定向（把 http 位置也转成 https）
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        let loc = res.headers.location;
        if (loc.startsWith('http://')) loc = 'https://' + loc.slice(7);
        if (loc.startsWith('/')) {
          const u = new URL(url); loc = 'https://' + u.host + loc;
        }
        return get(loc, ms).then(resolve);
      }
      if (res.statusCode !== 200) { res.resume(); return resolve(null); }
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (raw += c));
      res.on('end', () => resolve(raw));
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

function stripHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (m, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/\s+/g, ' ').trim();
}
function dedupeSentences(s) {
  if (!s) return '';
  const parts = s.split(/(?<=[。！？!?])/).map(x => x.trim()).filter(Boolean);
  const seen = new Set(); const out = [];
  for (const p of parts) { if (seen.has(p)) continue; seen.add(p); out.push(p); if (out.join('').length > 90) break; }
  return out.join('');
}

// 粗略提取 <item> 块
function parseItems(xml) {
  if (!xml) return [];
  const items = [];
  const re = /<item[\s\S]*?<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) items.push(m[0]);
  return items;
}
function tag(xml, name) {
  const re = new RegExp('<' + name + '[^>]*>([\\s\\S]*?)<\\/' + name + '>', 'i');
  const m = xml.match(re);
  if (m) return m[1].trim();
  // 自闭合/属性形式
  const re2 = new RegExp('<' + name + '[^>]*/>', 'i');
  return '';
}

const SOURCES = [
  // 时政
  { cat: '时政', name: '新华网', url: 'https://www.news.cn/' },
  // 财经
  { cat: '财经', name: '财经网', url: 'https://www.caijing.com.cn/' },
  // 消费
  { cat: '消费', name: '36氪', url: 'https://36kr.com/feed' },
  { cat: '消费', name: '亿邦动力', url: 'https://www.ebrun.com/rss.php' },
  // 综合 / 科技
  { cat: '消费', name: '少数派', url: 'https://sspai.com/feed' }
];

// 由于各大站 RSS 可用性不稳定，这里使用一组高可用的公开 RSS 镜像/聚合源
const RSS = [
  { cat: '时政', label: '中国新闻网', url: 'https://www.chinanews.com.cn/rss/scroll-news.xml' },
  { cat: '财经', label: '和讯财经', url: 'https://www.hexun.com/rss/news.xml' },
  { cat: '消费', label: '36氪', url: 'https://36kr.com/feed' },
  { cat: '消费', label: '钛媒体', url: 'https://www.tmtpost.com/rss.xml' }
];

// 苹果播客：通过 iTunes Search API 找 feedUrl（更稳健），再抓 RSS
const PODCASTS = [
  { t: '天真不天真', q: '天真不天真' },
  { t: '声动早咖啡', q: '声动早咖啡' },
  { t: '凹凸电波', q: '凹凸电波' },
  { t: '搞钱女孩', q: '搞钱女孩' }
];

async function lookupFeed(term) {
  const url = 'https://itunes.apple.com/search?media=podcast&term=' + encodeURIComponent(term) + '&limit=1&country=CN';
  const xml = null; // itunes 返回 json
  try {
    const data = await getJSON(url);
    if (data && data.results && data.results[0]) {
      const r = data.results[0];
      return { feedUrl: r.feedUrl, artist: r.artistName, cover: r.artworkUrl600 };
    }
  } catch (e) {}
  return null;
}
function getJSON(url, ms = 22000) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' }, timeout: ms }, (res) => {
      if (res.statusCode !== 200) { res.resume(); return resolve(null); }
      let raw = ''; res.setEncoding('utf8');
      res.on('data', (c) => (raw += c));
      res.on('end', () => { try { resolve(JSON.parse(raw)); } catch (e) { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

async function buildNews() {
  const out = [];
  for (const src of RSS) {
    const xml = await get(src.url);
    const items = parseItems(xml).slice(0, 4);
    for (const it of items) {
      const title = stripHtml(tag(it, 'title') || '');
      let desc = stripHtml(tag(it, 'description') || tag(it, 'summary') || '');
      // 去除重复的句子（同一句反复出现多为图注）
      desc = dedupeSentences(desc);
      if (!title) continue;
      let date = tag(it, 'pubDate') || tag(it, 'published') || '';
      try { date = new Date(date).toLocaleDateString('zh-CN'); } catch (e) {}
      out.push({
        cat: src.cat,
        t: title.slice(0, 60),
        s: (desc || '').slice(0, 70),
        date: date || new Date().toLocaleDateString('zh-CN'),
        src: src.label
      });
    }
  }
  // 去重 + 补足到至少 10 条
  const seen = new Set();
  const uniq = out.filter(n => { const k = n.t; if (seen.has(k)) return false; seen.add(k); return true; });
  return { updated: new Date().toISOString(), count: uniq.length, items: uniq.slice(0, 20) };
}

async function buildBlog() {
  const out = [];
  // 帆书（付费，仅占位说明）
  out.push({ t: '帆书 · 每周会员新书', src: '帆书 App', note: '会员专区每周更新，请于帆书 App 内收听。', latest: '（会员内容需登录，未抓取）', link: 'https://www.fanshu.com' });
  for (const p of PODCASTS) {
    let info = await lookupFeed(p.q);
    if (!info) { info = { feedUrl: null }; }
    let latest = '（暂未抓到最新单集）';
    let link = '';
    if (info.feedUrl) {
      const xml = await get(info.feedUrl);
      // 部分 feed 首条 <item> 是频道名，取前 3 条里第一个有实质标题的
      const items = parseItems(xml).slice(0, 3);
      for (const it of items) {
        const title = stripHtml(tag(it, 'title') || '');
        if (title && title.length > 1 && !/^天真不天真$|^声动早咖啡$|^凹凸电波$|^搞钱女孩$/.test(title)) {
          latest = title.slice(0, 50);
          const enc = tag(it, 'enclosure');
          const m = enc && enc.match(/url="([^"]+)"/);
          link = m ? m[1] : (tag(it, 'link') || '');
          break;
        }
      }
      if (!link && info.feedUrl) link = info.feedUrl;
    }
    out.push({ t: p.t, src: 'Apple Podcasts', note: info.artist || '', latest, link: link || (info.feedUrl || '') });
  }
  return { updated: new Date().toISOString(), items: out };
}

function buildHot() {
  // 抖音无公开 API：保留精选合集占位，人工维护更新。
  const items = [
    { t: '好物分享模板 #1 · 桌面小物', s: '低成本 · 可挂车 · 易复制', tip: '固定机位 + 特写 + 一句话种草，30 秒内讲清卖点。' },
    { t: '好物分享模板 #2 · 厨房神器', s: '演示型 · 高转化', tip: '先展示痛点，再上产品解决，结尾挂车。' },
    { t: '好物分享模板 #3 · 穿搭配件', s: '颜值向 · 适合女性号', tip: '自然光拍摄，配轻快 BGM，口播真实不夸张。' },
    { t: '好物分享模板 #4 · 收纳好物', s: '对比型 · 真实测评', tip: '前后对比画面，增强可信度。' }
  ];
  return { updated: new Date().toISOString(), note: '抖音无公开 API，爆款清单为精选合集，需人工维护更新。', items };
}

(async () => {
  const dataDir = path.join(__dirname, '..', 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  const news = await buildNews();
  const blog = await buildBlog();
  const hot = buildHot();
  fs.writeFileSync(path.join(dataDir, 'news.json'), JSON.stringify(news, null, 2));
  fs.writeFileSync(path.join(dataDir, 'blog.json'), JSON.stringify(blog, null, 2));
  fs.writeFileSync(path.join(dataDir, 'hot.json'), JSON.stringify(hot, null, 2));
  console.log('news:', news.count, '| blog:', blog.items.length, '| hot:', hot.items.length);
})();
