/* ===== 小新工作台 · 应用外壳 ===== */
const App = (() => {
  const NAV = [
    {id:'home',   ico:'🏠', name:'首页'},
    {id:'diet',   ico:'🍎', name:'饮食喝水'},
    {id:'sport',  ico:'🏃', name:'运动管理'},
    {id:'study',  ico:'📚', name:'学习管理'},
    {id:'express',ico:'💬', name:'表达能力'},
    {id:'outfit', ico:'👕', name:'穿搭助手'},
    {id:'beauty', ico:'💄', name:'妆容穿搭'},
    {id:'ledger', ico:'💰', name:'记账'},
    {id:'news',   ico:'📰', name:'行业新闻'},
    {id:'blogs',  ico:'🎧', name:'博客精选'},
    {id:'memo',   ico:'🖍️', name:'备忘录'},
    {id:'ailearn',ico:'🤖', name:'AI 学习'},
    {id:'hot',    ico:'🔥', name:'爆款二创'},
    {id:'info',   ico:'🌐', name:'新闻资讯'},
    {id:'weather',ico:'🌤', name:'天气'}
  ];
  let current='home';
  const $ = s=>document.querySelector(s);

  function renderNav(){
    $('#navList').innerHTML = NAV.map(n=>`<div class="nav-item ${n.id===current?'active':''}" data-go="${n.id}"><span class="ico">${n.ico}</span><span>${n.name}</span></div>`).join('');
    $('#navList').querySelectorAll('[data-go]').forEach(el=>el.onclick=()=>{go(el.dataset.go);closeNav();});
  }

  function render(page){
    if(page) current=page;
    const fn = Pages[current] || Pages.home;
    const {html,init} = fn();
    const view=$('#view');
    view.classList.remove('enter');void view.offsetWidth;view.classList.add('enter');
    view.innerHTML = html;
    $('#pageTitle').textContent = (NAV.find(n=>n.id===current)||{}).name || '工作台';
    renderNav();
    if(init) init();
    view.scrollTop=0;
  }

  function go(page){render(page);}

  /* 导航折叠/展开（桌面与移动端统一逻辑）
     - 窄栏（collapsed）= 仅图标常驻，不挡内容
     - 展开 = 图标+文字（桌面占布局，移动端浮层+遮罩） */
  function isMobile(){return window.matchMedia('(max-width:520px)').matches;}
  function setCollapsed(state){
    const nav=$('#nav'),mask=$('#navMask');
    nav.classList.toggle('collapsed',state);
    // 移动端展开时显示遮罩（点空白收起）；桌面端不需要
    mask.classList.toggle('show', state===false && isMobile());
    // 箭头方向：展开态显示「‹ 收起」，窄栏态显示「› 展开」
    const btn=$('#navClose');
    if(btn) btn.textContent = state ? '›' : '‹';
    U.store.set('navCollapsed',state);
  }
  function openNav(){ setCollapsed(false); }
  function closeNav(){ setCollapsed(true); }
  function toggleCollapse(){ setCollapsed(!$('#nav').classList.contains('collapsed')); }

  /* 下拉刷新 */
  function setupPTR(){
    const view=$('#view'),ptr=$('#ptr');
    let startY=0,pulling=false,dist=0;
    const TH=60;
    view.addEventListener('touchstart',e=>{
      if(view.scrollTop<=0){startY=e.touches[0].clientY;pulling=true;}
    },{passive:true});
    view.addEventListener('touchmove',e=>{
      if(!pulling)return;
      dist=e.touches[0].clientY-startY;
      if(dist>0&&view.scrollTop<=0){
        ptr.style.height=Math.min(dist,TH)+'px';
        ptr.querySelector('.ptr-text').textContent= dist>TH?'松开刷新…':'下拉刷新…';
      }
    },{passive:true});
    view.addEventListener('touchend',()=>{
      if(!pulling)return;pulling=false;
      if(dist>TH){ptr.style.height=TH+'px';ptr.classList.add('spin');ptr.querySelector('.ptr-text').textContent='刷新中…';
        setTimeout(()=>{ptr.style.height='0';ptr.classList.remove('spin');render(current);U.toast('已刷新');},600);
      }else{ptr.style.height='0';}
      dist=0;
    });
    // 顶部按钮刷新
    $('#refreshBtn').onclick=()=>{U.toast('刷新中…');render(current);};
  }

  function init(){
    // 电脑、手机均默认折叠为窄图标栏，不默认展开；已保存的偏好仍生效
    const collapsed = U.store.get('navCollapsed', true);
    $('#nav').classList.toggle('collapsed',collapsed);
    renderNav();
    render('home');
    $('#navToggle').onclick=toggleCollapse;   // ☰ 切换展开/收起
    $('#navClose').onclick=toggleCollapse;    // 折叠箭头按钮
    $('#navMask').onclick=closeNav;          // 移动端展开态点遮罩收起
    setupPTR();
  }

  return {init,render,go,NAV};
})();

document.addEventListener('DOMContentLoaded',App.init);

// 注册 Service Worker：让工作台可“添加到主屏幕”，全屏像原生 App、且可离线打开
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{ navigator.serviceWorker.register('./sw.js').catch(()=>{}); });
}
