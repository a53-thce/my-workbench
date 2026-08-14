/* ===== 小新工作台 · 各页面 ===== */
const Pages = (() => {
  const $ = (sel,el)=> (el||document).querySelector(sel);
  const $$ = (sel,el)=> Array.from((el||document).querySelectorAll(sel));
  const uid = ()=> Date.now().toString(36)+Math.random().toString(36).slice(2,6);

  /* ---------- 公共片段 ---------- */
  function waterRing(pct,cur,goal){
    const r=60,c=2*Math.PI*r,off=c*(1-Math.min(1,pct));
    return `<div class="ring">
      <svg width="140" height="140"><circle cx="70" cy="70" r="${r}" stroke="var(--cream-2)" stroke-width="14" fill="none"/>
      <circle cx="70" cy="70" r="${r}" stroke="url(#wg)" stroke-width="14" fill="none" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${off}"/>
      <defs><linearGradient id="wg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2726A"/><stop offset="1" stop-color="#C8473A"/></linearGradient></defs>
      </svg>
      <div class="ring-c"><b>${cur}</b><small>/ ${goal} ml</small></div>
    </div>`;
  }

  /* ============ 页面一：首页 ============ */
  function home(){
    const q=C.quoteOfDay();
    const now=new Date();
    const lunar=U.lunar(now);
    const zodiac=U.zodiac(now.getFullYear());
    const cd=U.store.get('countdowns',[{id:uid(),name:'爸爸生日',month:11,day:8},{id:uid(),name:'妈妈生日',month:6,day:15}]);
    const plans=U.store.get('plans',[]).filter(p=>p.date===U.todayKey());
    const renderCD=()=> cd.map(c=>{
      const left=U.birthdayLeft(c.month,c.day);
      return `<div class="count-item" data-id="${c.id}">
        <span class="emo">🎂</span><span class="nm">${c.name}</span>
        <span class="dd">${left<0?0:left}<small> 天后</small></span>
        <span class="del" data-delcd="${c.id}">×</span></div>`;
    }).join('')||'<div class="empty"><div class="e">🗓️</div>还没有倒计时，点下方添加~</div>';
    const renderPlans=()=> plans.map(p=>`
      <div class="plan-item ${p.done?'done':''}" data-pid="${p.id}">
        <div class="check" data-toggle="${p.id}">${p.done?'✓':''}</div>
        <span class="txt">${p.txt}</span>
        <span class="del" data-delplan="${p.id}">×</span></div>`).join('')||'<div class="empty"><div class="e">📝</div>今天还没有计划，添加一个吧</div>';
    const html=`
    <div class="hero">
      <div class="clock" id="hClock">--:--</div>
      <div class="date">${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 星期${U.WK[now.getDay()]} · 农历${lunar} · ${zodiac}年</div>
      <div class="hi">Hi，小新你好 🌿<br/><b>今天还没成为富婆吗？</b></div>
      <div class="quote"><div class="zh">${q.zh}</div><div class="en">${q.en}</div></div>
    </div>

    <div class="card">
      <div class="card-t">⏳ 倒计时 <span class="tag" id="addCD">＋ 新增</span></div>
      <div id="cdList">${renderCD()}</div>
    </div>

    <div class="card">
      <div class="card-t">✅ 每日计划 <span class="tag" id="addPlan">＋ 添加</span></div>
      <div id="planList">${renderPlans()}</div>
    </div>`;

    function init(){
      const tick=()=>{const e=$('#hClock');if(e)e.textContent=U.nowStr();};
      tick();const ti=setInterval(tick,1000);
      $('#view')._ti&&clearInterval($('#view')._ti);$('#view')._ti=ti;

      $('#addCD').onclick=()=>{
        U.openModal(`<h3>新增倒计时</h3>
          <label class="fld">名称</label><input id="cdName" placeholder="如：爸爸生日"/>
          <label class="fld">月份</label><input id="cdM" type="number" min="1" max="12" value="1"/>
          <label class="fld">日期</label><input id="cdD" type="number" min="1" max="31" value="1"/>
          <button class="btn block" style="margin-top:14px" id="cdSave">保存</button>`);
        $('#cdSave').onclick=()=>{
          const name=$('#cdName').value.trim()||'倒计时';const m=+($('#cdM').value);const d=+($('#cdD').value);
          cd.push({id:uid(),name,month:m,day:d});U.store.set('countdowns',cd);U.closeModal();render();
        };
      };
      $('#addPlan').onclick=()=>{
        U.openModal(`<h3>添加今日计划</h3><label class="fld">内容</label><input id="pn" placeholder="如：背 20 个单词"/>
          <button class="btn block" style="margin-top:14px" id="pnSave">添加</button>`);
        $('#pnSave').onclick=()=>{
          const t=$('#pn').value.trim();if(!t)return;
          const all=U.store.get('plans',[]);all.push({id:uid(),txt:t,done:false,date:U.todayKey()});
          U.store.set('plans',all);U.closeModal();render();
        };
      };
      $('#cdList').onclick=(e)=>{const id=e.target.getAttribute('data-delcd');if(id){const i=cd.findIndex(x=>x.id===id);if(i>=0)cd.splice(i,1);U.store.set('countdowns',cd);render();}};
      $('#planList').onclick=(e)=>{
        const t=e.target.getAttribute('data-toggle'),d=e.target.getAttribute('data-delplan');
        if(t){const all=U.store.get('plans',[]);const p=all.find(x=>x.id===t);if(p){p.done=!p.done;U.store.set('plans',all);render();}}
        if(d){const all=U.store.get('plans',[]);U.store.set('plans',all.filter(x=>x.id!==d));render();}
      };
    }
    function render(){App.render('home');}
    return {html,init};
  }

  /* ============ 页面二：饮食喝水 ============ */
  function diet(){
    const w=U.store.get('water',{goal:1500,log:[]});
    if(!Array.isArray(w.log))w.log=[];
    const today=U.todayKey();
    const todays=w.log.filter(r=>r.date===today);
    const cur=todays.reduce((s,r)=>s+r.ml,0);
    const pct=cur/w.goal;
    // 7天趋势
    let bars='';
    for(let i=6;i>=0;i--){
      const dk=new Date();dk.setDate(dk.getDate()-i);
      const key=dk.getFullYear()+'-'+U.pad(dk.getMonth()+1)+'-'+U.pad(dk.getDate());
      const sum=w.log.filter(r=>r.date===key).reduce((s,r)=>s+r.ml,0);
      const h=Math.min(100,(sum/(w.goal||1))*100);
      bars+=`<div style="flex:1;text-align:center"><div style="height:48px;display:flex;align-items:flex-end;justify-content:center"><div style="width:60%;background:linear-gradient(180deg,#E2726A,#C8473A);border-radius:6px 6px 0 0;height:${h}%;min-height:3px"></div></div><small class="tiny muted">${dk.getMonth()+1}/${dk.getDate()}</small></div>`;
    }

    const foods=U.store.get('foods',{breakfast:[],lunch:[],dinner:[],snack:[]});
    const cats=['breakfast','lunch','dinner','snack'];
    const catName={breakfast:'🍳 早餐',lunch:'🍱 午餐',dinner:'🍲 晚餐',snack:'🍎 加餐'};
    let totalK=0,tP=0,tC=0,tF=0;
    cats.forEach(c=>foods[c].forEach(f=>{totalK+=f.kcal||0;tP+=f.protein||0;tC+=f.carb||0;tF+=f.fat||0;}));
    const sum3=tP+tC+tF||1;
    const mealHtml=cats.map(c=>`
      <div class="card-t">${catName[c]} <span class="tag" data-addfood="${c}">＋</span></div>
      ${foods[c].map(f=>`<div class="list-item"><span class="li-emo">🍽️</span><div class="li-main"><div class="li-t">${f.name} <small class="muted">${f.weight}g</small></div><div class="li-s">${f.kcal} kcal · 蛋${f.protein} 碳${f.carb} 脂${f.fat}</div></div><span class="del" data-delfood="${c}|${f.id}">×</span></div>`).join('')||'<div class="empty" style="padding:14px">暂无</div>'}
    `).join('');

    // 待办清单
    const todos=U.store.get('todos',[{id:uid(),txt:'每日喝水 1500ml',done:cur>=w.goal,priority:'高',note:'自动关联喝水打卡',locked:true}]);
    const tHtml=todos.map(t=>`
      <div class="plan-item ${t.done?'done':''}" data-tid="${t.id}">
        <div class="check" data-tog="${t.id}">${t.done?'✓':''}</div>
        <span class="txt">${t.txt} ${t.priority?`<small class="li-tag">${t.priority}</small>`:''}</span>
        <span class="del" data-delt="${t.id}">×</span></div>`).join('')||'<div class="empty" style="padding:14px">暂无任务</div>';

    const html=`
    <div class="section-h">💧 喝水打卡</div>
    <div class="card center">
      ${waterRing(pct,cur,w.goal)}
      <div class="muted tiny" style="margin-top:8px">今日已喝 ${cur}ml · 剩余 <b style="color:var(--red-deep)">${Math.max(0,w.goal-cur)}ml</b></div>
      <div class="row" style="justify-content:center;margin-top:14px">
        <button class="btn sm" data-cup="200">＋200ml</button>
        <button class="btn sm" data-cup="300">＋300ml</button>
        <button class="btn sm" data-cup="500">＋500ml</button>
        <button class="btn ghost sm" id="cupManual">手动</button>
      </div>
      <label class="fld">每日目标（ml）</label>
      <input id="wGoal" type="number" value="${w.goal}"/>
      <label class="fld">定时提醒</label>
      <input id="wRemind" placeholder="如 09:00,14:00,20:00 用逗号分隔"/>
      <small class="tiny muted">设置后到点会在本页顶部提醒（需保持页面打开）</small>
    </div>
    <div class="card">
      <div class="card-t">📈 最近 7 天喝水</div>
      <div class="row" style="align-items:flex-end">${bars}</div>
    </div>

    <div class="section-h">🍱 饮食热量记录</div>
    <div class="card">
      <div class="card-t">📷 拍照识别 / 手动添加</div>
      <div class="row">
        <button class="btn sm" id="snap">📷 拍照/上传识别</button>
        <button class="btn ghost sm" id="manualFood">✍️ 手动添加</button>
      </div>
      <small class="tiny muted">拍照识别基于设备图片上传（演示版按常见食物估算热量）</small>
    </div>
    <div class="card">${mealHtml}</div>
    <div class="card">
      <div class="card-t">📊 今日汇总</div>
      <div class="row" style="margin-bottom:10px"><div class="stat"><b>${Math.round(totalK)}</b><small>总摄入 kcal</small></div></div>
      <div class="row" style="gap:6px">
        <div class="stat"><b>${Math.round(tP/sum3*100)}%</b><small>蛋白质 ${Math.round(tP)}g</small></div>
        <div class="stat"><b>${Math.round(tC/sum3*100)}%</b><small>碳水 ${Math.round(tC)}g</small></div>
        <div class="stat"><b>${Math.round(tF/sum3*100)}%</b><small>脂肪 ${Math.round(tF)}g</small></div>
      </div>
      <div class="bar" style="margin-top:10px"><span style="width:${tP/sum3*100}%"></span></div>
    </div>

    <div class="section-h">✅ 待办清单</div>
    <div class="card">
      <div class="card-t">任务 <span class="tag" id="addTodo">＋ 新增</span></div>
      ${tHtml}
      <small class="tiny muted">默认任务「每日喝水 1500ml」自动关联上方喝水进度；拖动排序、优先级、备注可在新增时设置。</small>
    </div>`;

    function init(){
      const addWater=(ml)=>{w.log.push({ml,date:today,time:U.nowStr()});U.store.set('water',w);App.render('diet');U.toast('已记录 '+ml+'ml');};
      $$('[data-cup]').forEach(b=>b.onclick=()=>addWater(+b.dataset.cup));
      $('#cupManual').onclick=()=>{U.openModal(`<h3>手动输入</h3><label class="fld">毫升数</label><input id="mm" type="number" placeholder="如 250"/><button class="btn block" style="margin-top:12px" id="mmok">记录</button>`);$('#mmok').onclick=()=>{const v=+$('#mm').value;if(v>0)addWater(v);U.closeModal();};};
      $('#wGoal').onchange=()=>{w.goal=+$('#wGoal').value||1500;U.store.set('water',w);App.render('diet');};
      $('#wRemind').value=w.remind||'';
      $('#wRemind').onchange=()=>{w.remind=$('#wRemind').value;U.store.set('water',w);U.toast('提醒已保存');};
      $('#snap').onclick=()=>{U.openModal(`<h3>拍照 / 上传食物</h3><p class="muted tiny">选择图片（演示版将按文件名/常见品类估算）。</p><input id="fimg" type="file" accept="image/*"/><button class="btn block" style="margin-top:12px" id="fok">识别并估算</button>`);
        $('#fok').onclick=()=>{const f=$('#fimg').files[0];if(!f){U.toast('请选择图片');return;}const guess={name:f.name.replace(/\.[^.]+$/,'')||'食物',weight:200,kcal:320,protein:18,carb:30,fat:12};addFood('lunch',guess);U.closeModal();U.toast('已识别（估算）');};};
      $('#manualFood').onclick=()=>{addFoodModal('lunch');};
      $$('[data-addfood]').forEach(b=>b.onclick=()=>addFoodModal(b.dataset.addfood));
      $('#view').onclick=(e)=>{
        const df=e.target.getAttribute('data-delfood');
        if(df){const[c,id]=df.split('|');foods[c]=foods[c].filter(x=>x.id!==id);U.store.set('foods',foods);App.render('diet');return;}
        const tg=e.target.getAttribute('data-tog'),dt=e.target.getAttribute('data-delt');
        if(tg){const t=todos.find(x=>x.id===tg);if(t&&!t.locked){t.done=!t.done;U.store.set('todos',todos);App.render('diet');}}
        if(dt){const t=todos.find(x=>x.id===dt);if(t&&!t.locked){U.store.set('todos',todos.filter(x=>x.id!==dt));App.render('diet');}}
      };
      $('#addTodo').onclick=()=>{
        U.openModal(`<h3>新增任务</h3><label class="fld">内容</label><input id="tt" placeholder="如：整理衣橱"/>
          <label class="fld">优先级</label><select id="tp"><option>高</option><option selected>中</option><option>低</option></select>
          <label class="fld">备注</label><input id="tn" placeholder="可选"/>
          <button class="btn block" style="margin-top:12px" id="ts">添加</button>`);
        $('#ts').onclick=()=>{const t=$('#tt').value.trim();if(!t)return;todos.push({id:uid(),txt:t,done:false,priority:$('#tp').value,note:$('#tn').value});U.store.set('todos',todos.filter(x=>!x.locked||true));App.render('diet');U.closeModal();};
      };
      // 定时喝水提醒
      const rm=w.remind?w.remind.split(',').map(s=>s.trim()).filter(Boolean):[];
      const checkRem=()=>{const now=U.nowStr();if(rm.includes(now))U.toast('💧 该喝水啦 ~ '+now);};
      clearInterval($('#view')._r);$('#view')._r=setInterval(checkRem,20000);
    }
    function addFoodModal(cat){
      U.openModal(`<h3>添加食物（${catName[cat]}）</h3>
        <label class="fld">名称</label><input id="fn" placeholder="如：鸡胸肉"/>
        <label class="fld">重量(g)</label><input id="fw" type="number" value="100"/>
        <label class="fld">热量(kcal)</label><input id="fk" type="number" value="0"/>
        <div class="row" style="margin-top:6px"><input id="fp" type="number" placeholder="蛋白g" value="0"/><input id="fc" type="number" placeholder="碳水g" value="0"/><input id="ff" type="number" placeholder="脂肪g" value="0"/></div>
        <button class="btn block" style="margin-top:12px" id="fs">保存</button>`);
      $('#fs').onclick=()=>{const f={id:uid(),name:$('#fn').value.trim()||'食物',weight:+$('#fw').value||0,kcal:+$('#fk').value||0,protein:+$('#fp').value||0,carb:+$('#fc').value||0,fat:+$('#ff').value||0};addFood(cat,f);U.closeModal();};
    }
    function addFood(cat,f){foods[cat]=foods[cat]||[];foods[cat].push(f);U.store.set('foods',foods);App.render('diet');}
    return {html,init};
  }

  /* ============ 页面三：运动管理 ============ */
  function sport(){
    const tab=U.store.get('sportTab','glutes');
    const meta={glutes:{t:'🍑 臀腿训练',data:C.VID.glutes},back:{t:'💛 肩背胳膊',data:C.VID.back},abs:{t:'🍂 腰腹训练',data:C.VID.abs}};
    const m=meta[tab];
    const counters=U.store.get('counters',{});
    const checkins=U.store.get('checkins',{});

    const items=m.data.map(v=>{
      let inner='';
      if(v.counter){
        const cur=counters[v.id]||0;
        inner=`<div class="vid-body"><div class="vt">${v.title}</div><div class="vs">${v.desc||''}</div>
          <div class="row bt"><b style="color:var(--red-deep)">${cur}/${v.target}</b><span class="muted tiny">个</span></div>
          <div class="bar" style="margin:8px 0"><span style="width:${Math.min(100,cur/v.target*100)}%"></span></div>
          <div class="vid-actions"><button class="btn sm" data-cnt="${v.id}">＋1</button><button class="btn ghost sm" data-cntreset="${v.id}">重置</button></div></div>`;
      } else if(v.manual){
        const done=!!checkins[v.id];
        inner=`<div class="vid-body"><div class="vt">${v.title}</div><div class="vs">${v.desc||''}</div>
          <div class="meta">${(v.tags||[]).map(t=>`<span class="pill">${t}</span>`).join('')}${v.duration?`<span class="pill">${v.duration}</span>`:''}</div>
          <div class="vid-actions"><button class="btn sm ${done?'ghost':''}" data-check="${v.id}">${done?'已打卡 ✓':'完成打卡'}</button>${v.url?`<a class="btn ghost sm" href="${v.url}" target="_blank">打开APP</a>`:''}</div></div>`;
      } else {
        const bvid=v.bvid;
        const done=!!checkins[v.id];
        const thumb=bvid?`<iframe src="${C.biliEmbed(bvid)}" allowfullscreen scrolling="no"></iframe>`:`<div class="play"><span>▶</span></div>`;
        inner=`<div class="vid-thumb">${thumb}</div><div class="vid-body"><div class="vt">${v.title}</div><div class="vs">${v.sub||''}</div>
          <div class="meta">${(v.tags||[]).map(t=>'<span class="pill">'+t+'</span>').join('')}${v.duration?'<span class="pill">'+v.duration+'</span>':''}</div>
          <div class="vid-actions"><a class="btn sm" href="${v.url}" target="_blank">${bvid?'跳转B站':'打开原视频'}</a>${bvid?'<button class="btn ghost sm" data-check="'+v.id+'">'+(done?'已打卡 ✓':'打卡')+'</button>':''}</div></div>`;
      }
      return `<div class="vid-card">${inner}</div>`;
    }).join('');

    const tabs=Object.keys(meta).map(k=>`<div class="tab ${k===tab?'on':''}" data-tab="${k}">${meta[k].t}</div>`).join('');
    const html=`<div class="tabs">${tabs}</div><div id="sportList">${items}</div>`;
    function init(){
      $$('[data-tab]').forEach(t=>t.onclick=()=>{U.store.set('sportTab',t.dataset.tab);App.render('sport');});
      $('#view').onclick=(e)=>{
        const c=e.target.getAttribute('data-cnt'),cr=e.target.getAttribute('data-cntreset'),ck=e.target.getAttribute('data-check');
        if(c){counters[c]=(counters[c]||0)+1;U.store.set('counters',counters);App.render('sport');}
        if(cr){counters[c]=0;U.store.set('counters',counters);App.render('sport');}
        if(ck){checkins[ck]=!checkins[ck];U.store.set('checkins',checkins);App.render('sport');U.toast(checkins[ck]?'打卡成功 💪':'已取消打卡');}
      };
    }
    return {html,init};
  }

  /* ============ 页面四：学习管理 ============ */
  function study(){
    const s=U.store.get('study',{totalDays:0,totalWords:0,done:{},fav:[],review:[]});
    const today=U.todayKey();
    const words=C.wordsOfDay();
    const doneToday=(s.done[today]||[]);
    const prog=Math.round(doneToday.length/words.length*100);
    const idx=U.store.get('studyIdx',0);
    const w=words[Math.min(idx,words.length-1)];

    const html=`
    <div class="section-h">📚 我的学习</div>
    <div class="card"><div class="row">
      <div class="stat"><b>${s.totalDays}</b><small>累计学习天数</small></div>
      <div class="stat"><b>${s.totalWords}</b><small>累计单词总量</small></div>
    </div></div>
    <div class="card">
      <div class="card-t">今日进度 <span class="tag">${doneToday.length}/${words.length}</span></div>
      <div class="bar"><span style="width:${prog}%"></span></div>
      <small class="tiny muted">进度 ${prog}%</small>
    </div>
    <div class="wcard" id="wcard"><div class="inner">
      <div class="face">
        <div class="word">${w.w}</div><div class="pho">${w.ph}</div>
        <div class="speak"><button class="btn sm" data-spk="${w.w}">🔊 朗读</button></div>
      </div>
      <div class="face back">
        <div class="mean">${w.m}</div>
        <div class="ex">${w.ex}</div>
        <div class="speak"><button class="btn sm ghost" data-fav="${w.w}">⭐ 收藏生词</button></div>
      </div>
    </div></div>
    <div class="row" style="margin-bottom:14px">
      <button class="btn sm" id="flip">翻转卡片</button>
      <button class="btn sm ghost" id="prev">上一个</button>
      <button class="btn sm ghost" id="next">下一个</button>
      <button class="btn sm ${doneToday.includes(w.w)?'ghost':''}" id="mark">${doneToday.includes(w.w)?'已学会 ✓':'标记为学会'}</button>
    </div>
    <div class="section-h">🔁 艾宾浩斯复习 & 生词本</div>
    <div class="card">
      <div class="card-t">⭐ 生词本 <span class="tag">${s.fav.length} 个</span></div>
      ${s.fav.length?`<div class="row" style="gap:6px">${s.fav.map(f=>`<span class="chip" data-unfav="${f}">${f} ×</span>`).join('')}</div>`:'<div class="empty" style="padding:14px">还没有收藏的生词</div>'}
    </div>`;
    function init(){
      const card=$('#wcard');
      $('#flip').onclick=()=>card.classList.toggle('flip');
      card.onclick=(e)=>{if(e.target.tagName!=='BUTTON')card.classList.toggle('flip');};
      $('#prev').onclick=()=>{let i=Math.max(0,U.store.get('studyIdx',0)-1);U.store.set('studyIdx',i);App.render('study');};
      $('#next').onclick=()=>{let i=Math.min(words.length-1,U.store.get('studyIdx',0)+1);U.store.set('studyIdx',i);App.render('study');};
      $('#mark').onclick=()=>{
        const dt=U.store.get('study',s).done[today]||[];
        const arr=s.done[today]||[];if(!arr.includes(w.w)){arr.push(w.w);s.done[today]=arr;s.totalWords++;s.totalDays=(new Set(Object.keys(s.done)).size);U.store.set('study',s);U.toast('已学会 '+w.w);App.render('study');}
      };
      $('#view').onclick=(e)=>{
        const spk=e.target.getAttribute('data-spk'),fav=e.target.getAttribute('data-fav'),un=e.target.getAttribute('data-unfav');
        if(spk){try{new SpeechSynthesisUtterance&&speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(spk);u.lang='en-US';speechSynthesis.speak(u);}catch(_){U.toast('朗读不可用');}}
        if(fav){if(!s.fav.includes(fav)){s.fav.push(fav);U.store.set('study',s);U.toast('已收藏');App.render('study');}}
        if(un){s.fav=s.fav.filter(x=>x!==un);U.store.set('study',s);App.render('study');}
      };
    }
    return {html,init};
  }

  /* ============ 页面五：表达能力 ============ */
  function express(){
    const tab=U.store.get('expTab','daily');
    const list=C.expOfDay();
    const fav=U.store.get('expFav',[]);
    const html=`
    <div class="tabs"><div class="tab ${tab==='daily'?'on':''}" data-et="daily">💬 日常表达</div><div class="tab ${tab==='work'?'on':''}" data-et="work">💼 职场表达</div></div>
    <label class="fld">关键词搜索</label><input id="expSearch" placeholder="如：拒绝 / 汇报"/>
    <div id="expList" style="margin-top:12px">${list.map((e,i)=>`
      <div class="card"><div class="card-t">${e.t} <span class="tag" data-efav="${i}">${fav.includes(tab+i)?'⭐':'☆'}</span></div>
      <div class="li-s" style="color:var(--ink)">${e.m}</div>
      <div class="li-s" style="margin-top:6px">💡 话术：<b>${e.s}</b></div></div>`).join('')}</div>
    <div class="section-h">⭐ 我的收藏</div>
    <div class="card">${fav.length?fav.map(f=>{const[i,t]=f.split('|');const item=C.EXP[+i]||{};return `<div class="list-item"><span class="li-emo">💡</span><div class="li-main"><div class="li-t">${item.t||''}</div></div></div>`;}).join(''):'<div class="empty" style="padding:14px">还没有收藏</div>'}</div>`;
    function init(){
      $$('[data-et]').forEach(t=>t.onclick=()=>{U.store.set('expTab',t.dataset.et);App.render('express');});
      $('#expSearch').oninput=(e)=>{const k=e.target.value.trim();const box=$('#expList');box.innerHTML=list.filter(x=>!k||(x.t+x.m+x.s).includes(k)).map((e,i)=>`<div class="card"><div class="card-t">${e.t} <span class="tag" data-efav="${i}">${fav.includes(tab+i)?'⭐':'☆'}</span></div><div class="li-s" style="color:var(--ink)">${e.m}</div><div class="li-s" style="margin-top:6px">💡 话术：<b>${e.s}</b></div></div>`).join('')||'<div class="empty" style="padding:14px">无匹配</div>';bindFav();};
      function bindFav(){$$('[data-efav]').forEach(b=>b.onclick=()=>{const key=tab+b.dataset.efav;const i=fav.indexOf(key);if(i>=0)fav.splice(i,1);else fav.push(key);U.store.set('expFav',fav);App.render('express');});}
      bindFav();
    }
    return {html,init};
  }

  /* ============ 页面六：穿搭助手 ============ */
  function outfit(){
    const wx=U.store.get('wx',null);
    const wd=U.store.get('wardrobe',[]);
    const outs=U.store.get('outfits',[]);
    const html=`
    <div class="section-h">🌤 今日天气</div>
    <div class="card" id="wxBox">${wx?`<div class="wx-card"><div class="wt">${U.wxEmo(wx.code)} ${U.wxText(wx.code)}</div><div class="wd">${wx.name} · ${wx.temp}°C · 风力 ${wx.wind}级</div></div>`:'<div class="empty"><div class="e">🌥️</div>点击获取实时天气</div>'}<button class="btn sm" id="getWx" style="margin-top:8px">${wx?'刷新天气':'获取天气'}</button></div>

    <div class="section-h">👕 衣橱管理</div>
    <div class="card"><div class="row">
      <button class="btn sm" id="addCloth">📷 录入衣物</button>
      <button class="btn ghost sm" id="aiOutfit">🤖 AI 生成方案</button>
    </div>
    <div class="grid" style="grid-template-columns:repeat(3,1fr);margin-top:10px">
      ${wd.length?wd.map(c=>`<div class="memo-note" style="margin:0;padding:8px"><div style="height:70px;background:var(--cream-2);border-radius:10px;background-size:cover;background-position:center;${c.img?`background-image:url(${c.img})`:''};display:flex;align-items:center;justify-content:center;font-size:26px">${c.img?'':(c.cat||'👕')}</div><div class="tiny" style="margin-top:4px;font-weight:700">${c.name}</div><div class="tiny muted">${c.color}·${c.season}</div><span class="del" data-delc="${c.id}" style="position:absolute;right:6px;top:4px">×</span></div>`).join(''):'<div class="empty" style="grid-column:1/-1;padding:14px">衣橱空空，先录入几件吧</div>'}
    </div></div>

    <div class="section-h">🌟 今日穿搭</div>
    <div class="card">
      <button class="btn sm block" id="upOutfit">📸 上传今日穿搭</button>
      ${outs.length?outs.slice(-3).reverse().map(o=>`<div class="list-item"><span class="li-emo">👗</span><div class="li-main"><div class="li-t">${o.date}</div><div class="li-s">${o.note||'已保存'}</div></div></div>`).join(''):'<div class="empty" style="padding:14px">还没有穿搭记录</div>'}
    </div>

    <div class="section-h">🤖 AI 穿搭小助手</div>
    <div class="card" id="aiChat">
      <div class="li-s" style="background:var(--cream-2);padding:10px;border-radius:10px;margin-bottom:8px">AI：告诉我你的场合（通勤/约会/运动），我帮你从衣橱搭配~</div>
      <div id="aiMsgs"></div>
      <div class="row" style="margin-top:8px"><input id="aiInput" placeholder="问 AI 搭配…"/><button class="btn sm" id="aiSend">发送</button></div>
    </div>`;
    function init(){
      $('#getWx').onclick=async()=>{U.toast('获取天气中…');const r=await U.weather(U.CHANGSHU.lat,U.CHANGSHU.lon,U.CHANGSHU.name);if(r.ok){const c=r.current;U.store.set('wx',{name:r.name,code:c.weathercode,temp:Math.round(c.temperature_2m),wind:Math.round(c.windspeed_10m/3.6)});}else{U.store.set('wx',{name:'常熟',code:2,temp:22,wind:2});}App.render('outfit');};
      $('#addCloth').onclick=()=>{U.openModal(`<h3>录入衣物</h3><label class="fld">图片</label><input id="ci" type="file" accept="image/*"/><label class="fld">名称</label><input id="cn" placeholder="如：白色衬衫"/><div class="row" style="gap:6px"><input id="cc" placeholder="颜色" value="白"/><select id="cs"><option>春</option><option>夏</option><option selected>秋</option><option>冬</option></select><select id="cst"><option>通勤</option><option>休闲</option><option>甜酷</option><option>运动</option></select></div><label class="fld">品类</label><select id="cca"><option>👕 上衣</option><option>👖 裤装</option><option>👗 裙装</option><option>🧥 外套</option><option>👟 鞋履</option><option>👜 配饰</option></select><button class="btn block" style="margin-top:12px" id="csave">保存</button>`);
        $('#csave').onclick=async()=>{const f=$('#ci').files[0];let img='';if(f)img=await fileToData(f);wd.push({id:uid(),img,name:$('#cn').value.trim()||'衣物',color:$('#cc').value,season:$('#cs').value,style:$('#cst').value,cat:$('#cca').value,status:'常穿'});U.store.set('wardrobe',wd);U.closeModal();App.render('outfit');};};
      $('#view').onclick=(e)=>{const dc=e.target.getAttribute('data-delc');if(dc){U.store.set('wardrobe',wd.filter(x=>x.id!==dc));App.render('outfit');}};
      $('#upOutfit').onclick=()=>{U.openModal(`<h3>上传今日穿搭</h3><label class="fld">照片</label><input id="oi" type="file" accept="image/*"/><label class="fld">备注 / 心情</label><input id="on" placeholder="如：今天通勤，自信满满"/><button class="btn block" style="margin-top:12px" id="osave">保存记录</button>`);
        $('#osave').onclick=()=>{const w=U.store.get('wx',{temp:20});outs.push({date:U.todayKey()+' '+U.nowStr(),note:($('#on').value||'已保存')+' ｜气温约'+(w.temp||'?')+'°C，'+(w.temp>28?'注意轻薄透气':w.temp<10?'注意保暖 layers':'体感舒适，随意穿搭')});U.store.set('outfits',outs);U.closeModal();App.render('outfit');U.toast('穿搭已记录 🌟');};};
      $('#aiOutfit').onclick=()=>{const w=U.store.get('wx',{temp:20});const tips=wd.length?`根据衣橱 ${wd.length} 件单品，气温约 ${w.temp}°C：${w.temp>28?'建议短袖+短裤/裙子，浅色透气。':w.temp<10?'建议外套+内搭叠穿，保暖为主。':'建议薄外套+长裤，舒适百搭。'}`:'衣橱还没有单品，先去录入吧~';U.toast('已生成方案：'+tips);};
      $('#aiSend').onclick=()=>{const v=$('#aiInput').value.trim();if(!v)return;const msgs=$('#aiMsgs');msgs.innerHTML+=`<div class="li-s" style="text-align:right;color:var(--red-deep);margin:4px 0">${v}</div>`;const reply=`收到~ 结合你的衣橱（${wd.length}件）和天气，建议：${v.includes('约会')?'甜酷连衣裙+小高跟，温柔又有记忆点。':v.includes('通勤')?'衬衫+西装裤+乐福鞋，干练得体。':v.includes('运动')?'运动套装+跑鞋，舒适优先。':'根据场合选主色，同色系更显高。'}`;setTimeout(()=>{msgs.innerHTML+=`<div class="li-s" style="background:var(--cream-2);padding:8px;border-radius:8px;margin:4px 0">${reply}</div>`;},400);$('#aiInput').value='';};
    }
    return {html,init};
  }
  function fileToData(file){return new Promise(res=>{const r=new FileReader();r.onload=()=>res(r.result);r.readAsDataURL(file);});}

  /* ============ 页面七：妆容穿搭 ============ */
  function beauty(){
    const tab=U.store.get('beautyTab','makeup');
    const data=tab==='makeup'?C.BEAUTY.makeup:C.BEAUTY.dress;
    const fav=U.store.get('beautyFav',[]);
    const html=`
    <div class="tabs"><div class="tab ${tab==='makeup'?'on':''}" data-bt="makeup">💄 妆容教程</div><div class="tab ${tab==='dress'?'on':''}" data-bt="dress">👗 穿搭推荐</div></div>
    <small class="tiny muted">适配：阔面 / 瓜子脸 / 圆脸 / 小个子 · 参考博主：抖音@陈圆圆超可爱 @一一只是黑猫 @麻辣烫</small>
    <div style="margin-top:12px">${data.map((d,i)=>`<div class="vid-card"><div class="vid-thumb"><div class="play"><span>${d.col}</span></div></div><div class="vid-body"><div class="vt">${d.t}</div><div class="vs">${d.s}</div><div class="meta"><span class="pill">${d.src}</span></div><div class="vid-actions"><button class="btn ghost sm" data-bfav="${tab+i}">${fav.includes(tab+i)?'⭐ 已收藏':'☆ 收藏'}</button></div></div></div>`).join('')}</div>`;
    function init(){
      $$('[data-bt]').forEach(t=>t.onclick=()=>{U.store.set('beautyTab',t.dataset.bt);App.render('beauty');});
      $('#view').onclick=(e)=>{const f=e.target.getAttribute('data-bfav');if(f){const i=fav.indexOf(f);if(i>=0)fav.splice(i,1);else fav.push(f);U.store.set('beautyFav',fav);App.render('beauty');U.toast('已更新收藏');}};
    }
    return {html,init};
  }

  /* ============ 页面八：记账 ============ */
  function ledger(){
    const data=U.store.get('ledger',{budget:3000,income:8000,records:[]});
    if(!data.records)data.records=[];
    const today=U.todayKey();
    const todays=data.records.filter(r=>r.date===today).sort((a,b)=>b.time.localeCompare(a.time));
    const todaySum=todays.reduce((s,r)=>s+r.amount,0);
    // 年度
    const year=new Date().getFullYear();
    const months=Array.from({length:12},(_,i)=>{const sum=data.records.filter(r=>{const d=new Date(r.date);return d.getFullYear()===year&&d.getMonth()===i;}).reduce((s,r)=>s+r.amount,0);return sum;});
    const yearOut=months.reduce((a,b)=>a+b,0);
    const yearInc=data.income; // 简化：按月收入*12
    const catCount={};todays.concat(data.records.filter(r=>{const d=new Date(r.date);return d.getFullYear()===year;})).forEach(r=>{catCount[r.platform]=(catCount[r.platform]||0)+r.amount;});
    const catArr=Object.entries(catCount).sort((a,b)=>b[1]-a[1]);
    const maxC=catArr.length?catArr[0][1]:1;
    const html=`
    <div class="section-h">💰 本月设置</div>
    <div class="card"><div class="row" style="gap:8px">
      <div class="stat"><b>${U.money(data.budget)}</b><small>本月预算</small></div>
      <div class="stat"><b>${U.money(data.income)}</b><small>本月收入</small></div>
    </div>
    <div class="row" style="margin-top:10px"><label class="fld">调整预算</label><input id="lb" type="number" value="${data.budget}"/></div>
    <div class="row" style="margin-top:8px"><label class="fld">调整收入</label><input id="li" type="number" value="${data.income}"/><button class="btn sm" id="lSave">保存</button></div>
    <div class="row" style="margin-top:10px"><label class="fld">今日收入录入</label><input id="lin" type="number" placeholder="如 500"/><button class="btn ghost sm" id="linSave">记入</button></div>
    </div>

    <div class="section-h">📝 记一笔</div>
    <div class="card">
      <label class="fld">购物平台</label><select id="lp"><option>抖音</option><option>快手</option><option>拼多多</option><option>淘宝</option><option>外卖</option><option>线下</option><option>其他</option></select>
      <label class="fld">金额</label><input id="la" type="number" placeholder="0.00"/>
      <label class="fld">购买物品</label><input id="li2" placeholder="如：护肤精华"/>
      <label class="fld">备注</label><input id="ln" placeholder="可选"/>
      <button class="btn block" style="margin-top:12px" id="lAdd">记一笔</button>
    </div>

    <div class="section-h">🧾 今日消费清单</div>
    <div class="card"><div class="row" style="margin-bottom:8px"><b>今日总消费</b><b style="color:var(--red-deep)">¥${U.money(todaySum)}</b></div>
      ${todays.length?todays.map(r=>`<div class="ledger"><div class="lp">${platIcon(r.platform)}</div><div class="lm"><b>${r.item||'消费'}</b><small>${r.platform} · ${r.time}</small>${r.note?`<div class="lm-t">${r.note}</div>`:''}</div><div class="amt">¥${U.money(r.amount)}</div><span class="del" data-delr="${r.id}">×</span></div>`).join(''):'<div class="empty" style="padding:14px">今天还没记账</div>'}
    </div>

    <div class="section-h">📊 年度总览（${year}）</div>
    <div class="card">
      <div class="row" style="margin-bottom:10px">
        <div class="stat"><b>${U.money(yearInc)}</b><small>年收入(估)</small></div>
        <div class="stat"><b>${U.money(yearOut)}</b><small>年支出</small></div>
        <div class="stat"><b style="color:var(--good)">${U.money(yearInc-yearOut)}</b><small>结余</small></div>
      </div>
      <div class="card-t">12 个月支出柱状图</div>
      <div class="row" style="align-items:flex-end;height:120px">${months.map((m,i)=>`<div style="flex:1;text-align:center"><div style="height:${Math.max(2,m/ (Math.max(...months)||1)*100)}%;background:linear-gradient(180deg,#E2726A,#C8473A);border-radius:4px 4px 0 0;min-height:2px"></div><small class="tiny muted">${i+1}月</small></div>`).join('')}</div>
      <div class="card-t" style="margin-top:14px">消费分类占比</div>
      ${catArr.map(([k,v])=>`<div class="row" style="margin:6px 0"><span style="width:54px;font-size:12px">${k}</span><div class="bar" style="flex:1"><span style="width:${v/maxC*100}%"></span></div><span class="tiny muted" style="width:64px;text-align:right">¥${U.money(v)}</span></div>`).join('')||'<div class="empty" style="padding:10px">暂无数据</div>'}
    </div>`;
    function init(){
      $('#lSave').onclick=()=>{data.budget=+$('#lb').value||0;data.income=+$('#li').value||0;U.store.set('ledger',data);U.toast('已保存');};
      $('#linSave').onclick=()=>{const v=+$('#lin').value;if(v>0){data.income=(data.income||0)+v;U.store.set('ledger',data);U.toast('收入已记 +'+v);App.render('ledger');}};
      $('#lAdd').onclick=()=>{const amount=+$('#la').value;if(!amount){U.toast('请输入金额');return;}data.records.push({id:uid(),date:today,time:U.nowStr(),platform:$('#lp').value,amount,item:$('#li2').value.trim(),note:$('#ln').value.trim()});U.store.set('ledger',data);U.toast('已记账');App.render('ledger');};
      $('#view').onclick=(e)=>{const id=e.target.getAttribute('data-delr');if(id){data.records=data.records.filter(r=>r.id!==id);U.store.set('ledger',data);App.render('ledger');}};
    }
    return {html,init};
  }
  function platIcon(p){return {抖音:'🎵',快手:'⚡',拼多多:'🛒',淘宝:'🛍️',外卖:'🍔',线下:'🏪',其他:'📦'}[p]||'📦';}

  /* ============ 页面九：行业新闻 ============ */
  function news(){
    const list=C.newsOfDay();
    const html=`<div class="section-h">📰 行业新闻（每日更新）</div>
      <div class="tabs"><div class="tab on">时政</div><div class="tab on">财经</div><div class="tab on">消费</div></div>
      ${list.map(n=>`<div class="news"><div class="nk">${n.c==='时政'?'🏛️':n.c==='财经'?'💹':'🛒'}</div><div class="nmain"><div class="nt">${n.t}</div><div class="ns">${n.c} · ${n.date}</div><div class="nc">${n.s}</div></div></div>`).join('')}
      <small class="tiny muted">内容每日按日期轮换更新；如需接入实时新闻源，可在部署后配置新闻 API。</small>`;
    return {html,init:()=>{}};
  }

  /* ============ 页面十：博客精选 ============ */
  function blogs(){
    const html=`<div class="section-h">🎧 博客精选（每日更新）</div>
      ${C.BLOGS.map(b=>`<div class="news"><div class="nk">🎙️</div><div class="nmain"><div class="nt">${b.t}</div><div class="ns">${b.src} · 每周/每日更新</div><div class="nc">在对应 App（帆书 / Apple Podcasts）搜索收听。</div></div></div>`).join('')}
      <small class="tiny muted">帆书会员新书专区 + 苹果播客：天真不天真 / 声动早咖啡 / 凹凸电波 / 搞钱女孩。</small>`;
    return {html,init:()=>{}};
  }

  /* ============ 页面十一：备忘录 ============ */
  function memo(){
    const list=U.store.get('memos',[{id:uid(),title:'欢迎使用小新备忘录 🖍️',text:'在这里随手记点什么吧～ 蜡笔小新陪你每一天！',color:'#FFFDF6'}]);
    const html=`<div class="section-h">🖍️ 备忘录 <span class="tag" id="addMemo">＋ 新建</span></div>
      <div class="deco">🖍️🌿🖍️</div>
      ${list.map(m=>`<div class="memo-note" data-mid="${m.id}" style="background:${m.color}"><div class="mt">${m.title}</div><div class="li-s" style="white-space:pre-wrap">${m.text}</div><span class="del" data-delm="${m.id}">×</span></div>`).join('')}`;
    function init(){
      $('#addMemo').onclick=()=>{U.openModal(`<h3>新建备忘</h3><label class="fld">标题</label><input id="mt" placeholder="标题"/><label class="fld">内容</label><textarea id="mb" rows="4" placeholder="写点什么…"></textarea><button class="btn block" style="margin-top:12px" id="ms">保存</button>`);
        $('#ms').onclick=()=>{const t=$('#mt').value.trim()||'无标题';const b=$('#mb').value.trim();if(!b&&!t)return;list.push({id:uid(),title:t,text:b,color:'#FFFDF6'});U.store.set('memos',list);U.closeModal();App.render('memo');};};
      $('#view').onclick=(e)=>{
        const dm=e.target.getAttribute('data-delm');if(dm){U.store.set('memos',list.filter(x=>x.id!==dm));App.render('memo');}
        const note=e.target.closest('.memo-note');if(note&&!dm){const id=note.dataset.mid;const m=list.find(x=>x.id===id);U.openModal(`<h3>编辑备忘</h3><label class="fld">标题</label><input id="mt" value="${m.title}"/><label class="fld">内容</label><textarea id="mb" rows="4">${m.text}</textarea><button class="btn block" style="margin-top:12px" id="ms">保存</button>`);
          $('#ms').onclick=()=>{m.title=$('#mt').value.trim()||'无标题';m.text=$('#mb').value.trim();U.store.set('memos',list);U.closeModal();App.render('memo');};}
      };
    }
    return {html,init};
  }

  /* ============ 页面十二：AI 学习 ============ */
  function ailearn(){
    const html=`<div class="section-h">🤖 AI 学习（普通人可学）</div>
      <small class="tiny muted">精选 B 站 / 抖音 上适合新手的 AI 教程，从陌生到熟悉。</small>
      ${C.AI_LEARN.map(a=>`<div class="news"><div class="nk">${a.col}</div><div class="nmain"><div class="nt">${a.t}</div><div class="ns">${a.s}</div></div><a class="btn ghost sm" href="${a.url}" target="_blank">前往</a></div>`).join('')}
      <div class="card"><div class="card-t">📌 学习路径建议</div><div class="li-s">1) 先熟悉一个 AI 助手（如 WorkBuddy）的日常用法 → 2) 学 AI 绘画/文生图打基础 → 3) 尝试 AI 动漫/动画短片 → 4) 用剪映 AI 成片做短视频。</div></div>`;
    return {html,init:()=>{}};
  }

  /* ============ 页面十三：爆款二创 ============ */
  function hot(){
    const html=`<div class="section-h">🔥 爆款二创（每日 9:00 更新）</div>
      <small class="tiny muted">抖音好物分享 · 挂车爆款短视频 · 普通人易复制。</small>
      ${[1,2,3,4].map(i=>`<div class="vid-card"><div class="vid-thumb"><div class="play"><span>▶</span></div></div><div class="vid-body"><div class="vt">好物分享模板 #${i}</div><div class="vs">低成本 · 可挂车 · 易复制</div><div class="meta"><span class="pill">抖音</span><span class="pill">带货</span></div><div class="vid-actions"><a class="btn ghost sm" href="https://www.douyin.com" target="_blank">去抖音看</a></div></div></div>`).join('')}
      <small class="tiny muted">演示内容；接入后将于每天 9:00 自动拉取最新爆款清单。</small>`;
    return {html,init:()=>{}};
  }

  /* ============ 页面十四：新闻资讯 ============ */
  function info(){
    const list=C.NEWS_POOL.slice(0,10);
    const html=`<div class="section-h">🌐 新闻资讯（每日 9:00 更新）</div>
      ${list.map((n,i)=>`<div class="news"><div class="nk">${i+1}</div><div class="nmain"><div class="nt">${n.t}</div><div class="ns">${n.c} · ${U.fmtDate()}</div><div class="nc">${n.s}</div></div></div>`).join('')}
      <small class="tiny muted">每日至少 10 条；接入实时源后自动刷新。</small>`;
    return {html,init:()=>{}};
  }

  /* ============ 页面十五：天气 ============ */
  function weather(){
    const saved=U.store.get('wx7',null);
    let html=`<div class="section-h">🌤 常熟近 7 天天气</div><div class="card center"><div class="empty"><div class="e">🌥️</div>点击获取常熟 7 天天气</div><button class="btn" id="gw">获取天气</button></div>`;
    if(saved){
      html=`<div class="section-h">🌤 常熟近 7 天天气</div>
        <div class="wx-card"><div class="wt">${U.wxEmo(saved.current.weathercode)} ${U.wxText(saved.current.weathercode)}</div><div class="wd">常熟 · 实时 ${Math.round(saved.current.temperature_2m)}°C · 风力 ${Math.round(saved.current.windspeed_10m/3.6)}级</div></div>
        <div class="card"><div class="wx-7">${saved.days.time.slice(0,7).map((t,i)=>{const d=new Date(t);return `<div class="d"><b>${d.getMonth()+1}/${d.getDate()}</b><div class="e">${U.wxEmo(saved.days.weathercode[i])}</div><div class="t">${Math.round(saved.days.temperature_2m_min[i])}°/${Math.round(saved.days.temperature_2m_max[i])}°</div></div>`;}).join('')}</div></div>
        <button class="btn ghost block" id="gw">刷新</button>`;
    }
    function init(){
      const load=async()=>{U.toast('获取中…');const r=await U.weather(U.CHANGSHU.lat,U.CHANGSHU.lon,U.CHANGSHU.name);if(r.ok){U.store.set('wx7',{current:r.current,days:r.days});}else{U.toast('获取失败，请检查网络');}App.render('weather');};
      const b=$('#gw');if(b)b.onclick=load;
    }
    return {html,init};
  }

  return {home,diet,sport,study,express,outfit,beauty,ledger,news,blogs,memo,ailearn,hot,info,weather};
})();
