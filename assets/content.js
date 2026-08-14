/* ===== 小新工作台 · 内容种子数据 ===== */
const C = (() => {

  // 每日激励（中英）——循环取用
  const QUOTES = [
    {zh:'今天的努力，是幸运的伏笔。',en:'Today’s effort is the foreshadowing of luck.'},
    {zh:'慢慢来，比较快。',en:'Slow is smooth, smooth is fast.'},
    {zh:'你不必很厉害才能开始，但你要开始才能很厉害。',en:'You don’t have to be great to start, but you have to start to be great.'},
    {zh:'把平凡的日子，过出光来。',en:'Light up the ordinary days.'},
    {zh:'自律给你自由。',en:'Discipline equals freedom.'},
    {zh:'每一个不曾起舞的日子，都是对生命的辜负。',en:'Every day unlived to the full is a betrayal of life.'},
    {zh:'种一棵树最好的时间是十年前，其次是现在。',en:'The best time to plant a tree was ten years ago; the second best is now.'},
    {zh:'保持热爱，奔赴山海。',en:'Keep the love, and head for the mountains and seas.'},
    {zh:'你只管努力，剩下的交给时间。',en:'Just work hard; leave the rest to time.'},
    {zh:'温柔且有力量，是女生最好的模样。',en:'Gentle yet strong is the best version of you.'}
  ];
  function quoteOfDay(){
    const i = Math.floor((Date.now()/(24*3600*1000))) % QUOTES.length;
    return QUOTES[i];
  }

  // 运动视频库
  // embed: 有 bvid 可内嵌播放器；否则只跳转
  const VID = {
    glutes:[
      {id:'g1',title:'Eleni Fit · 30 分钟全身燃脂训练',sub:'热身 · 燃脂 · 无跳跃',bvid:'BV1bgqmBrEhZ',url:'https://www.bilibili.com/video/BV1bgqmBrEhZ/',tags:['热身','燃脂','无跳跃'],checkin:true,desc:'全身热身激活，跟练即可。'},
      {id:'g2',title:'腿部专项训练（外购课程）',sub:'需从其他 APP 进入 · 此处仅打卡',url:'',tags:['付费课程','自备'],manual:true,desc:'用户自有付费课程，仅做展示与打卡记录。预计时长约 40 分钟。',duration:'约40分钟'},
      {id:'g3',title:'足弓芭蕾蹲 300 个',sub:'计数器跟练',counter:true,target:300,desc:'点击 +1 计数，完成后可重置。'},
    ],
    back:[
      {id:'b1',title:'瘦胳膊训练（搬运自用）',sub:'B 站 UP：_可可可可可乐搬运 · cr logo 侵删',bvid:'BV1dE411q7Lf',url:'https://www.bilibili.com/video/BV1dE411q7Lf/?share_source=copy_web&vd_source=fa494a8f065c03696a64976f0e66e46e',tags:['跟练','瘦臂'],checkin:true},
      {id:'b2',title:'美丽芭蕾天鹅臂（全网最清晰版）',sub:'B 站 UP：美丽芭蕾经典视频榜 · 约 15 分钟',url:'https://www.bilibili.com/list/ml3182013783',tags:['天鹅臂','体态'],checkin:true,duration:'约15分钟',desc:'每天坚持，2 周见效。'},
      {id:'b3',title:'欧阳春晓 30 分钟 Barre 芭杆上肢雕刻',sub:'体态薄背 · 精准发力',bvid:'BV1QRpAzzECe',url:'https://www.bilibili.com/video/BV1QRpAzzECe/',tags:['芭杆','薄背'],checkin:true,desc:'全程站立、口令指导、低冲击。'},
      {id:'b4',title:'yuuka · 8 分钟直角肩锻炼',sub:'抚平斜方肌 · 8 分钟',bvid:'BV1sE421L7jn',url:'https://www.bilibili.com/video/BV1sE421L7jn/',tags:['直角肩','斜方肌'],checkin:true,duration:'8分钟'},
      {id:'b5',title:'体态大师 气场女王 2024 版',sub:'改善圆肩驼背 / 头前伸 / 富贵包',bvid:'BV1aJ4m187Kk',url:'https://www.bilibili.com/video/BV1aJ4m187Kk/',tags:['体态','气场'],checkin:true,desc:'改善圆肩驼背、头前伸、富贵包、斜方肌大。'},
      {id:'b6',title:'欧阳春晓 直角肩 + 少女背',sub:'约 10-15 分钟 · 消除斜方肌',bvid:'BV1TBPSzLEKz',url:'https://www.bilibili.com/video/BV1TBPSzLEKz/',tags:['直角肩','少女背'],checkin:true,duration:'约10-15分钟'},
    ],
    abs:[
      {id:'a1',title:'帕梅拉 3000 步有氧（2000+1000）',sub:'燃脂瘦全身',bvid:'BV1oTRuYhEnf',url:'https://www.bilibili.com/video/BV1oTRuYhEnf/?share_source=copy_web&vd_source=fa494a8f065c03696a64976f0e66e46e',tags:['有氧','燃脂'],checkin:true},
      {id:'a2',title:'欧阳春晓 20 分钟开胯松髋',sub:'根除小肚腩 · 告别假胯宽',bvid:'BV1Qb4y1q7bU',url:'https://www.bilibili.com/video/BV1Qb4y1q7bU/?share_source=copy_web&vd_source=fa494a8f065c03696a64976f0e66e46e',tags:['骨盆','假胯宽'],checkin:true,duration:'20分钟'},
      {id:'a3',title:'欧阳春晓 芭杆沙漏腰',sub:'30 分钟完整版',bvid:'BV14rZcB4EtH',url:'https://www.bilibili.com/video/BV14rZcB4EtH/?share_source=copy_web&vd_source=fa494a8f065c03696a64976f0e66e469',tags:['沙漏腰'],checkin:true,duration:'30分钟'},
      {id:'a4',title:'欧阳春晓 沙漏腰 3.0 进阶',sub:'30 分钟站立无跑跳核心',bvid:'BV13DJVzEkK7',url:'https://www.bilibili.com/video/BV13DJVzEkK7/?share_source=copy_web&vd_source=fa494a8f065c03696a64976f0e66e46e',tags:['核心','进阶'],checkin:true,duration:'30分钟'},
      {id:'a5',title:'欧阳春晓 普拉提瘦腹瘦肚',sub:'20 分钟私教级口令带练',bvid:'BV1pQ4y1g7C3',url:'https://www.bilibili.com/video/BV1pQ4y1g7C3/?share_source=copy_web&vd_source=fa494a8f065c03696a64976f0e66e464',tags:['普拉提','瘦腹'],checkin:true,duration:'20分钟'},
      {id:'a6',title:'死虫式 1000 正式跟练',sub:'阿新专注女子塑形（抖音）',url:'https://v.douyin.com/K5AkvpZb6vl/',tags:['死虫式','抖音'],checkin:true,desc:'复制链接，打开抖音搜索观看。量力而行。'},
      {id:'a7',title:'10 分钟腰腹拉伸',sub:'缓解酸痛 · 美化马甲线',bvid:'BV17b4y1X7YD',url:'https://www.bilibili.com/video/BV17b4y1X7YD/?share_source=copy_web&vd_source=fa494a8f065c03696a64976f0e66e46e',tags:['拉伸','放松'],checkin:true,duration:'10分钟'},
    ]
  };
  function biliEmbed(bvid){
    return `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0&autoplay=0`;
  }

  // 学习：单词池（按日期切片取 20）
  const WORDS = [
    {w:'abandon',ph:'/əˈbændən/',m:'放弃；抛弃',ex:'He had to abandon the plan.'},
    {w:'brilliant',ph:'/ˈbrɪljənt/',m:'杰出的；明亮的',ex:'She is a brilliant student.'},
    {w:'courage',ph:'/ˈkʌrɪdʒ/',m:'勇气',ex:'It takes courage to say no.'},
    {w:'delicate',ph:'/ˈdelɪkət/',m:'精致的；脆弱的',ex:'The flower is very delicate.'},
    {w:'elegant',ph:'/ˈelɪɡənt/',m:'优雅的',ex:'She wore an elegant dress.'},
    {w:'frequent',ph:'/ˈfriːkwənt/',m:'频繁的',ex:'He is a frequent visitor.'},
    {w:'generous',ph:'/ˈdʒenərəs/',m:'慷慨的',ex:'She is generous with her time.'},
    {w:'harmony',ph:'/ˈhɑːməni/',m:'和谐',ex:'Live in harmony with nature.'},
    {w:'illustrate',ph:'/ˈɪləstreɪt/',m:'说明；举例',ex:'Let me illustrate my point.'},
    {w:'journey',ph:'/ˈdʒɜːni/',m:'旅程',ex:'Life is a long journey.'},
    {w:'knowledge',ph:'/ˈnɒlɪdʒ/',m:'知识',ex:'Knowledge is power.'},
    {w:'luminous',ph:'/ˈluːmɪnəs/',m:'发光的',ex:'The moon is luminous tonight.'},
    {w:'magnificent',ph:'/mæɡˈnɪfɪsnt/',m:'壮丽的',ex:'What a magnificent view!'},
    {w:'nourish',ph:'/ˈnʌrɪʃ/',m:'滋养',ex:'Good food nourishes the body.'},
    {w:'obstacle',ph:'/ˈɒbstəkl/',m:'障碍',ex:'Failure is an obstacle to growth.'},
    {w:'peaceful',ph:'/ˈpiːsfl/',m:'平静的',ex:'The lake is peaceful at dawn.'},
    {w:'quality',ph:'/ˈkwɒləti/',m:'质量；品质',ex:'We value quality over speed.'},
    {w:'resilient',ph:'/rɪˈzɪliənt/',m:'有韧性的',ex:'She is resilient under pressure.'},
    {w:'sincere',ph:'/sɪnˈsɪə/',m:'真诚的',ex:'He gave a sincere apology.'},
    {w:'tranquil',ph:'/ˈtræŋkwɪl/',m:'宁静的',ex:'The garden is tranquil.'},
    {w:'unique',ph:'/juˈniːk/',m:'独特的',ex:'Every person is unique.'},
    {w:'vivid',ph:'/ˈvɪvɪd/',m:'生动的',ex:'She has a vivid imagination.'},
    {w:'whisper',ph:'/ˈwɪspə/',m:'低语',ex:'She whispered a secret.'},
    {w:'youthful',ph:'/ˈjuːθfl/',m:'年轻的',ex:'She has a youthful spirit.'},
    {w:'zeal',ph:'/ziːl/',m:'热情',ex:'He works with great zeal.'},
    {w:'adapt',ph:'/əˈdæpt/',m:'适应',ex:'We must adapt to change.'},
    {w:'balance',ph:'/ˈbæləns/',m:'平衡',ex:'Keep a balance between work and life.'},
    {w:'candidate',ph:'/ˈkændɪdət/',m:'候选人',ex:'She is a strong candidate.'},
    {w:'dedicate',ph:'/ˈdedɪkeɪt/',m:'致力于',ex:'He dedicated his life to art.'},
    {w:'efficient',ph:'/ɪˈfɪʃnt/',m:'高效的',ex:'We need an efficient system.'},
    {w:'fabulous',ph:'/ˈfæbjələs/',m:'极好的',ex:'The party was fabulous.'},
    {w:'grateful',ph:'/ˈɡreɪtfl/',m:'感激的',ex:'I am grateful for your help.'},
    {w:'honest',ph:'/ˈɒnɪst/',m:'诚实的',ex:'Be honest with yourself.'},
    {w:'inspire',ph:'/ɪnˈspaɪə/',m:'激励',ex:'Her story inspired me.'},
    {w:'justify',ph:'/ˈdʒʌstɪfaɪ/',m:'证明…正当',ex:'How do you justify this?'},
    {w:'kindness',ph:'/ˈkaɪndnəs/',m:'善意',ex:'A small kindness matters.'},
    {w:'logic',ph:'/ˈlɒdʒɪk/',m:'逻辑',ex:'There is no logic in that.'},
    {w:'modest',ph:'/ˈmɒdɪst/',m:'谦虚的',ex:'He is modest about his success.'},
    {w:'negotiate',ph:'/nɪˈɡəʊʃieɪt/',m:'谈判',ex:'They negotiated a deal.'},
    {w:'optimistic',ph:'/ˌɒptɪˈmɪstɪk/',m:'乐观的',ex:'Stay optimistic about the future.'},
    {w:'patient',ph:'/ˈpeɪʃnt/',m:'耐心的',ex:'Be patient with yourself.'},
    {w:'reliable',ph:'/rɪˈlaɪəbl/',m:'可靠的',ex:'She is a reliable friend.'},
    {w:'sufficient',ph:'/səˈfɪʃnt/',m:'足够的',ex:'We have sufficient time.'},
    {w:'tolerant',ph:'/ˈtɒlərənt/',m:'宽容的',ex:'Be tolerant of differences.'},
    {w:'upright',ph:'/ˈʌpraɪt/',m:'正直的',ex:'An upright person keeps promises.'},
    {w:'vigorous',ph:'/ˈvɪɡərəs/',m:'精力充沛的',ex:'Take vigorous exercise.'},
    {w:'willing',ph:'/ˈwɪlɪŋ/',m:'乐意的',ex:'I am willing to help.'},
    {w:'worthy',ph:'/ˈwɜːði/',m:'值得的',ex:'A worthy cause deserves support.'},
    {w:'yield',ph:'/jiːld/',m:'产出；让步',ex:'The investment yields profit.'},
    {w:'zone',ph:'/zəʊn/',m:'区域；状态',ex:'Get into the flow zone.'}
  ];
  function wordsOfDay(){
    const d = Math.floor(Date.now()/(24*3600*1000));
    const start = (d*20) % WORDS.length;
    let out=[];
    for(let i=0;i<20;i++) out.push(WORDS[(start+i)%WORDS.length]);
    return out;
  }

  // 表达话术：按日期取 10
  const EXP = [
    {t:'高情商接话：把"我也…"换成"你…"',m:'把话题焦点放回对方，让人感到被重视。',s:'对方抱怨加班，别说"我也经常加"，说"你也太辛苦了，今晚打算怎么犒劳自己？"'},
    {t:'委婉拒绝：先肯定，再给替代',m:'拒绝不伤人的核心是：认可 + 原因 + 替代方案。',s:'"这个提议很好，不过这周我排满了，下周二是不是更合适？"'},
    {t:'化解尴尬：自嘲或转移',m:'尴尬时主动降维，气氛立刻松弛。',s:'说错话时笑一下："看我这嘴，关键时刻总掉链子。"'},
    {t:'真诚赞美：具体 > 笼统',m:'夸到细节，对方才信。',s:'别只说"你好漂亮"，说"你今天这条丝巾和西装很搭，显得很精神"。'},
    {t:'工作汇报：结论先行',m:'领导要的是结果，不是过程。',s:'"本周目标完成 90%，卡在 X，已约明天解决。需要您确认 Y。"'},
    {t:'会议发言：用"三点法"',m:'结构化表达更显专业。',s:'"我的看法有三点：第一…第二…第三…"'},
    {t:'跨部门沟通：对齐目标',m:'先谈共同目标，再谈分工。',s:'"咱们目标都是准时上线，那资源上我建议这样分…"'},
    {t:'职场礼仪：邮件 24h 内回',m:'哪怕只是"收到，稍后回复"，也别已读不回。',s:'不确定时先回："已收到，今天下午给您完整方案。"'},
    {t:'主动破冰：从环境聊起',m:'陌生场合用中性话题开场最安全。',s:'"这家咖啡店的拿铁不错，你常来这附近吗？"'},
    {t:'表达不同意见：先"是的，而且"',m:'用补充代替反驳，减少对抗。',s:'"你说得对，而且如果我们加上数据对比，说服力会更强。"'},
    {t:'请求帮助：给对方台阶',m:'说明价值与边界，更容易获助。',s:'"这事只有你最熟，方便的话帮我看看？不急，这周五前都行。"'},
    {t:'结束对话：给个收尾',m:'体面离场也是情商。',s:'"今天聊得很开心，先不耽误你了，咱们下次再约。"'}
  ];
  function expOfDay(){
    const d = Math.floor(Date.now()/(24*3600*1000));
    const start=(d*10)%EXP.length;
    let out=[];for(let i=0;i<10;i++)out.push(EXP[(start+i)%EXP.length]);
    return out;
  }

  // 穿搭/妆容 参考视频（抖音博主示例）
  const BEAUTY = {
    makeup:[
      {t:'瓜子脸/圆脸 通勤妆',s:'日常通勤 · 自然裸妆感',col:'💄',ref:'抖音 @陈圆圆超可爱',bvid:'BV1Bm421M7EL',url:'https://www.bilibili.com/video/BV1Bm421M7EL'},
      {t:'日常淡妆教程',s:'清透伪素颜',col:'💄',ref:'抖音 @一一只是黑猫',bvid:'BV1NqMMzzEbE',url:'https://www.bilibili.com/video/BV1NqMMzzEbE'},
      {t:'约会甜美妆',s:'粉嫩元气 · 约会必看',col:'💄',ref:'抖音 @麻辣烫',bvid:'BV1Yd4y1T7BY',url:'https://www.bilibili.com/video/BV1Yd4y1T7BY'},
    ],
    dress:[
      {t:'小个显高穿搭',s:'上短下长 · 同色系延伸',col:'👗',ref:'抖音 @一一只是黑猫',bvid:'BV1w44y1q7tF',url:'https://www.bilibili.com/video/BV1w44y1q7tF'},
      {t:'甜酷日常风',s:'扬长避短搭配思路',col:'👗',ref:'抖音 @麻辣烫',bvid:'BV15KgAzGEtP',url:'https://www.bilibili.com/video/BV15KgAzGEtP'},
      {t:'圆脸显瘦发型妆容',s:'修饰脸型',col:'👗',ref:'抖音 @陈圆圆超可爱',bvid:'BV1Qf4y157Sx',url:'https://www.bilibili.com/video/BV1Qf4y157Sx'},
    ]
  };

  // AI 学习（B站/抖音 普通人可学）
  const AI_LEARN=[
    {t:'WorkBuddy 从陌生到熟悉',s:'AI 助手入门实操',url:'https://www.bilibili.com',col:'🤖'},
    {t:'AI 动漫制作入门',s:'用 AI 生成动画短片流程',url:'https://www.bilibili.com',col:'🎬'},
    {t:'AI 绘画 Midjourney 实战',s:'从提示词到成图',url:'https://www.bilibili.com',col:'🎨'},
    {t:'剪映 AI 成片',s:'一键生成短视频',url:'https://www.douyin.com',col:'✂️'},
    {t:'AI 数字人带货',s:'普通人也能做的口播',url:'https://www.douyin.com',col:'🗣️'},
  ];

  // 博客精选（帆书 + 苹果播客指定栏目）
  const BLOGS=[
    {t:'帆书 · 每周会员新书',s:'樊登读书会员专区 · 每周更新',src:'帆书 App'},
    {t:'天真不天真',s:'苹果播客 · 生活与成长对谈',src:'Apple Podcasts'},
    {t:'声动早咖啡',s:'苹果播客 · 用一杯咖啡的时间读懂商业',src:'Apple Podcasts'},
    {t:'凹凸电波',s:'苹果播客 · 轻松有趣的文化闲聊',src:'Apple Podcasts'},
    {t:'搞钱女孩',s:'苹果播客 · 女性成长与搞钱思路',src:'Apple Podcasts'},
  ];

  // 行业新闻示例（时政/财经/消费，按日期轮换）—— 无 key 时使用精选摘要
  const NEWS_POOL=[
    {c:'时政',t:'政策暖风频吹，民生保障再升级',s:'多部门联合发文，聚焦养老、育儿与就业支持，预计下半年落地见效。'},
    {c:'财经',t:'A股震荡上行，消费板块领涨',s:'受促消费政策提振，食品饮料、家电板块资金净流入明显。'},
    {c:'消费',t:'即时零售爆发，30 分钟达成标配',s:'美团、京东、抖音加码即时零售，本地生活竞争进入分钟级。'},
    {c:'财经',t:'央行维持流动性合理充裕',s:'公开市场操作加码，市场利率保持低位运行。'},
    {c:'消费',t:'国货美妆出海提速',s:'平价高质国货在东南亚走红，跨境直播成新增长极。'},
    {c:'时政',t:'城市更新行动稳步推进',s:'老旧小区改造与适老化建设成为重点投资方向。'},
    {c:'财经',t:'新能源产业链估值修复',s:'碳酸锂价格企稳，电池与整车板块情绪回暖。'},
    {c:'消费',t:'宠物经济持续高热',s:'陪伴经济崛起，宠物食品、医疗、服务赛道扩容。'},
  ];
  function newsOfDay(){
    const d=Math.floor(Date.now()/(24*3600*1000));
    return NEWS_POOL.map((n,i)=>({...n,date:U.fmtDate(new Date(Date.now()+0))})).sort(()=>0).slice(0,6);
  }

  return {QUOTES,quoteOfDay,VID,biliEmbed,WORDS,wordsOfDay,EXP,expOfDay,BEAUTY,AI_LEARN,BLOGS,NEWS_POOL,newsOfDay};
})();
