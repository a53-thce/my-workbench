/* ===== 小新工作台 · 基础工具 ===== */
const U = (() => {
  // ---- 本地存储 ----
  const PREFIX = 'xinwb_';
  const store = {
    get(k, def) {
      try { const v = localStorage.getItem(PREFIX + k); return v == null ? def : JSON.parse(v); }
      catch (e) { return def; }
    },
    set(k, v) { try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(PREFIX + k); } catch (e) {} }
  };

  // ---- 日期 ----
  const WK = ['日','一','二','三','四','五','六'];
  function pad(n){return n<10?'0'+n:''+n;}
  function todayKey(d){ d=d||new Date(); return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
  function nowStr(d){ d=d||new Date(); return pad(d.getHours())+':'+pad(d.getMinutes()); }
  function fmtDate(d){ d=d||new Date(); return `${d.getMonth()+1}月${d.getDate()}日 周${WK[d.getDay()]}`; }

  // ---- 简化农历（1900-2100 近似，来源于公开算法）----
  const LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
  0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
  0x0d520];
  const LUNAR_MONTH = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
  const LUNAR_DAY1 = ['初','十','廿','卅'];
  const LUNAR_DAY2 = ['一','二','三','四','五','六','七','八','九','十'];
  const SOLAR_TERM = ['小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'];
  function lYearDays(y){let s=348;for(let i=0x8000;i>0x8;i>>=1)s+=(LUNAR_INFO[y-1900]&i)?1:0;return s;}
  function leapMonth(y){return LUNAR_INFO[y-1900]&0xf;}
  function leapDays(y){if(leapMonth(y))return((LUNAR_INFO[y-1900]&0x10000)?30:29);return 0;}
  function monthDays(y,m){return((LUNAR_INFO[y-1900]&(0x10000>>m))?30:29);}
  function solarTerm(y,n){const offDate=new Date((31556925974.7*(y-1900)+Math.floor((1.242452*n+20.27)*60*60*1000))+Date.UTC(1900,0,6,2,5)).getUTCDate();return offDate;}
  function lunar(d){
    d=d||new Date();
    let y=d.getFullYear(),m=d.getMonth()+1,day=d.getDate();
    let baseDate=new Date(1900,0,31);let offset=Math.round((d-baseDate)/86400000);
    let temp=0,i=1900;for(i=1900;i<2101&&offset>0;i++){temp=lYearDays(i);offset-=temp;}
    if(offset<0){offset+=temp;i--;}
    let leap=leapMonth(i),isLeap=false;
    for(let j=1;j<13&&offset>0;j++){
      if(leap>0&&j==(leap+1)&&!isLeap){isLeap=true;j--;temp=leapDays(i);}
      else{temp=monthDays(i,j);}
      if(isLeap&&j==(leap+1))isLeap=false;
      offset-=temp;
    }
    if(offset==0&&leap>0&&j==leap+1){if(isLeap){isLeap=false;}else{isLeap=true;j--;}}
    if(offset<0){offset+=temp;j--;}
    let month=j,isLeapM=isLeap;
    let cd=offset+1;
    let cm=isLeapM?('闰'+LUNAR_MONTH[month-1]):LUNAR_MONTH[month-1];
    if(cd==1)return cm+'月';
    let dd=(cd<=10?LUNAR_DAY1[0]+LUNAR_DAY2[cd-1]:cd<=20?LUNAR_DAY1[1]+LUNAR_DAY2[(cd-11)%10]:cd<=30?LUNAR_DAY1[2]+LUNAR_DAY2[(cd-21)%10]:LUNAR_DAY1[3]+'');
    return cm+'月'+dd;
  }
  const ZODIAC=['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
  function zodiac(y){return ZODIAC[(y-4)%12];}
  function springFestival(y){
    // 近似：取当年农历正月初一的阳历日期
    let d=new Date(y,0,1),off=0;
    for(let i=0;i<60;i++){ if(lunar(new Date(y,0,1+i)).indexOf('正月')===0 && lunar(new Date(y,0,1+i)).length<=3){ return new Date(y,0,1+i);} }
    return new Date(y,1,1);
  }

  // 距离目标日期天数（按日期，不含今年是否已过）
  function daysLeft(target){ // target: Date
    const t=new Date(target.getFullYear(),target.getMonth(),target.getDate());
    const n=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
    return Math.round((t-n)/86400000);
  }
  function birthdayLeft(month,day){ // 今年/明年的生日
    const now=new Date();
    let y=now.getFullYear();
    let b=new Date(y,month-1,day);
    if(b<now) b=new Date(y+1,month-1,day);
    return daysLeft(b);
  }

  // ---- Toast ----
  let toastTimer;
  function toast(msg){
    const el=document.getElementById('toast');
    if(!el)return;
    el.textContent=msg;el.classList.add('show');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),1900);
  }

  // ---- Modal ----
  function openModal(html){
    const mask=document.getElementById('modal'),box=document.getElementById('modalBox');
    box.innerHTML='<button class="close-x" onclick="U.closeModal()">×</button>'+html;
    mask.classList.add('show');mask.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    const mask=document.getElementById('modal');
    mask.classList.remove('show');mask.setAttribute('aria-hidden','true');
  }
  document.addEventListener('click',(e)=>{
    const mask=document.getElementById('modal');
    if(mask&&mask.classList.contains('show')&&e.target===mask)closeModal();
  });

  // ---- 简单确认 ----
  function confirm(msg){
    return new Promise(res=>{
      openModal(`<h3>提示</h3><p class="muted">${msg}</p><div class="row" style="margin-top:12px"><button class="btn ghost sm" onclick="U.closeModal();window.__cf(false)">取消</button><button class="btn sm" onclick="U.closeModal();window.__cf(true)">确定</button></div>`);
      window.__cf=res;
    });
  }

  // ---- 数字/格式化 ----
  function money(n){return (n||0).toLocaleString('zh-CN',{maximumFractionDigits:2});}

  // ---- 天气（Open-Meteo 真实，无需 key）----
  async function weather(lat,lon,name){
    try{
      const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&current=temperature_2m,weathercode,windspeed_10m&timezone=Asia%2FShanghai&forecast_days=7`);
      const j=await r.json();
      return {ok:true,name,current:j.current,days:j.daily};
    }catch(e){return {ok:false,err:e.message};}
  }
  const WX_CODE={0:'晴',1:'晴间多云',2:'多云',3:'阴',45:'雾',48:'雾凇',51:'毛毛雨',53:'小雨',55:'中雨',56:'冻雨',57:'冻雨',61:'小雨',63:'中雨',65:'大雨',66:'冻雨',67:'冻雨',71:'小雪',73:'中雪',75:'大雪',77:'雪粒',80:'阵雨',81:'阵雨',82:'强阵雨',85:'阵雪',86:'强阵雪',95:'雷阵雨',96:'雷阵雨伴雹',99:'强雷暴'};
  const WX_E={0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',56:'🌧️',57:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',66:'🌧️',67:'🌧️',71:'🌨️',73:'🌨️',75:'❄️',77:'🌨️',80:'🌦️',81:'🌦️',82:'⛈️',85:'🌨️',86:'🌨️',95:'⛈️',96:'⛈️',99:'⛈️'};
  function wxText(c){return WX_CODE[c]||'未知';}
  function wxEmo(c){return WX_E[c]||'🌡️';}

  // 常熟默认（江苏常熟 31.65,120.75）
  const CHANGSHU={lat:31.65,lon:120.75,name:'常熟'};

  // ---- 抓取 JSON（带缓存破坏与超时）----
  async function fetchJSON(url, ms=9000){
    try{
      const ctrl = (typeof AbortController!=='undefined') ? new AbortController() : null;
      const t = ctrl ? setTimeout(()=>ctrl.abort(), ms) : null;
      const r = await fetch(url+(url.includes('?')?'&':'?')+'_='+Date.now(), {signal: ctrl?ctrl.signal:undefined, cache:'no-store'});
      if(t) clearTimeout(t);
      if(!r.ok) throw new Error('HTTP '+r.status);
      return await r.json();
    }catch(e){ return null; }
  }

  // 去除 HTML 标签并解码常见实体
  function stripHtml(s){
    if(!s) return '';
    return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1')
      .replace(/<[^>]+>/g,' ')
      .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
      .replace(/&quot;/g,'"').replace(/&#0?39;|&apos;/g,"'").replace(/&#x([0-9a-f]+);/gi,(m,h)=>String.fromCharCode(parseInt(h,16)))
      .replace(/\s+/g,' ').trim();
  }

  return {store,todayKey,nowStr,fmtDate,pad,WK,lunar,zodiac,birthdayLeft,daysLeft,toast,openModal,closeModal,confirm,money,weather,wxText,wxEmo,CHANGSHU,springFestival,fetchJSON,stripHtml};
})();
