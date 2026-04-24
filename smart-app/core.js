// ── CONFIG ──
const LS_USERS='sf_users',LS_SESSION='sf_sess';
const lsData=u=>`sf_data_${u}`;
const TIPS=['Use the Pomodoro technique: 25 min focus, 5 min break, repeat.','Review flashcards daily using spaced repetition for best retention.','Write notes in your own words to boost understanding.','Sleep is crucial for memory consolidation — rest well before exams.','Teach concepts to others (or yourself) to deepen understanding.','Break large tasks into smaller milestones and celebrate each win 🎉','Active recall beats re-reading — quiz yourself constantly!','Start with the hardest subject when your energy is highest.','Use mnemonics and visual associations for difficult concepts.','Stay consistent — 30 minutes daily beats 4 hours before the exam.'];
const AI_RESP={
  greet:['Hello! 👋 Ready to study? I\'m here to help you learn smarter, not harder!','Hi there! 🧠 What can I help you with today?','Hey! Great time to learn something new 🚀'],
  tip:['📚 Top study tips:\n1. Space your practice sessions\n2. Test yourself regularly\n3. Teach what you learn\n4. Sleep well\n5. Remove distractions\n6. Take handwritten notes','💡 Try active recall: instead of re-reading, close your book and write everything you remember. It\'s 3x more effective!','🎯 The Feynman Technique: explain a concept in simple words as if teaching a child. If you can\'t, you don\'t understand it yet.'],
  spaced:['🃏 Spaced repetition means reviewing information at increasing intervals.\n• Day 1: learn\n• Day 2: review\n• Day 4: review again\n• Day 8: review\n• Day 16... and so on.\n\nStudyFlow\'s flashcard system does this automatically!','The science behind spaced repetition: each time you successfully recall something, the memory trace strengthens, so you need to review it less often over time.'],
  pomodoro:['⏱️ The Pomodoro Technique:\n1. Choose a task\n2. Set timer for 25 minutes\n3. Work with full focus\n4. Take 5 min break\n5. After 4 sessions, take 15 min break\n\nThis builds concentration and prevents burnout!'],
  notes:['📝 Better note-taking strategies:\n• Cornell Method: divide page into notes, cues, summary\n• Mind Maps: visualize connections\n• Outline Method: hierarchical structure\n• Use your own words — never copy verbatim\n• Review notes within 24 hours of taking them'],
  exam:['📋 Exam prep timeline:\n• 2 weeks before: review all material\n• 1 week before: focus on weak areas\n• 3 days before: practice past papers\n• 1 day before: light review, sleep early\n• Exam day: eat well, arrive early, stay calm 🧘'],
  motivate:['🔥 Every expert was once a beginner. Keep going!','💪 You\'re not behind. You\'re learning at your own pace, and that\'s perfect.','⭐ Progress, not perfection. Small steps every day compound into huge results!','🚀 The fact that you\'re here studying means you\'re already ahead of who you were yesterday!'],
  math:['📐 Math study tips:\n• Do problems daily — math is a skill, not just memorization\n• Show all steps — don\'t skip to answers\n• Understand WHY formulas work\n• Make a formula sheet and memorize it\n• Practice timed problems for exams'],
  science:['🔬 Science study strategies:\n• Connect concepts to real life\n• Draw and label diagrams\n• Use flashcards for terminology\n• Understand the WHY, not just the WHAT\n• Group related concepts together'],
  default:['I\'m here to help! Ask me about study techniques, specific subjects, exam prep, or anything learning-related! 🧠','Great question! Could you be more specific so I can give you the best advice? 💬','I can help with study tips, Pomodoro technique, flashcard strategies, exam preparation, and much more!']
};

// ── STATE ──
let users={},currentUser=null,userData=null;
let editingRemId=null,editingDeckId=null,editingCardId=null,editingNoteId=null,activeDeckId=null;
let studyQueue=[],studyIdx=0,cardFlipped=false;
let pomTimer=null,pomRemaining=0,pomMode='work',pomSessions=0,pomRunning=false;
let quizDeckId=null,quizQuestions=[],quizIdx=0,quizScore=0;
let confirmCb=null,selectedAvatarColor='#7c3aed',selectedDeckColor='#7c3aed';

// ── STORAGE ──
function saveUsers(){localStorage.setItem(LS_USERS,JSON.stringify(users))}
function loadUsers(){try{users=JSON.parse(localStorage.getItem(LS_USERS)||'{}')}catch{users={}}}
function saveData(){if(currentUser)localStorage.setItem(lsData(currentUser.username),JSON.stringify(userData))}
function loadData(u){try{return JSON.parse(localStorage.getItem(lsData(u))||'null')}catch{return null}}
function defaultData(){return{reminders:[],decks:[],notes:[],pomSessions:[],quizHistory:[],activity:{}}}
function uid(p=''){return p+Date.now()+Math.random().toString(36).slice(2,7)}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function today(){return new Date().toISOString().slice(0,10)}
function fmt(d){if(!d)return '';try{return new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}catch{return d}}
function fmtDt(d,t){return fmt(d)+(t?' '+t:'')}
function isOverdue(d,t){if(!d)return false;const dt=new Date(`${d}T${t||'23:59'}`);return dt<new Date()}
function getStreak(){const log=userData.activity||{};let s=0,d=new Date();for(let i=0;i<365;i++){const k=new Date(d);k.setDate(k.getDate()-i);const key=k.toISOString().slice(0,10);if(log[key]&&log[key]>0)s++;else if(i>0)break;}return s}
function logActivity(mins=1){const k=today();userData.activity=userData.activity||{};userData.activity[k]=(userData.activity[k]||0)+mins;saveData()}

// ── AUTH ──
function hashPw(pw){return btoa(encodeURIComponent(pw+'_sf26'))}
function showTab(t){document.getElementById('loginForm').classList.toggle('hidden',t!=='login');document.getElementById('registerForm').classList.toggle('hidden',t==='login');document.getElementById('tab-login').classList.toggle('active',t==='login');document.getElementById('tab-register').classList.toggle('active',t!=='login')}
function togglePw(id,btn){const el=document.getElementById(id);el.type=el.type==='password'?'text':'password';btn.textContent=el.type==='password'?'👁':'🙈'}
function pickAvatarColor(el){document.querySelectorAll('#avatarPicker .c-dot').forEach(d=>d.classList.remove('sel'));el.classList.add('sel');selectedAvatarColor=el.dataset.c}

function handleLogin(e){
  e.preventDefault();
  const u=document.getElementById('lgUser').value.trim();
  const p=document.getElementById('lgPass').value;
  const err=document.getElementById('lgErr');
  if(!users[u]){err.textContent='User not found.';return}
  if(users[u].password!==hashPw(p)){err.textContent='Wrong password.';return}
  if(!users[u].active){err.textContent='Account disabled.';return}
  loginUser(u);
}

function handleRegister(e){
  e.preventDefault();
  const name=document.getElementById('rgName').value.trim();
  const u=document.getElementById('rgUser').value.trim().toLowerCase();
  const email=document.getElementById('rgEmail').value.trim();
  const pw=document.getElementById('rgPass').value;
  const conf=document.getElementById('rgConf').value;
  const grade=document.getElementById('rgGrade').value;
  const err=document.getElementById('rgErr');
  if(!name||!u||!pw){err.textContent='Name, username, and password are required.';return}
  if(pw.length<6){err.textContent='Password must be at least 6 characters.';return}
  if(pw!==conf){err.textContent='Passwords do not match.';return}
  if(users[u]){err.textContent='Username already taken.';return}
  if(!/^[a-z0-9_]{3,20}$/.test(u)){err.textContent='Username: 3-20 chars, letters/numbers/underscore only.';return}
  users[u]={username:u,name,email,grade,color:selectedAvatarColor,password:hashPw(pw),joined:today(),active:true,settings:{pomWork:25,pomShort:5,pomLong:15}};
  saveUsers();
  loginUser(u);
}

function loginUser(u){
  currentUser=users[u];
  localStorage.setItem(LS_SESSION,u);
  userData=loadData(u)||defaultData();
  saveData();
  document.getElementById('authOverlay').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  initApp();
}

function handleLogout(){
  if(pomRunning)clearInterval(pomTimer);
  currentUser=null;userData=null;
  localStorage.removeItem(LS_SESSION);
  document.getElementById('app').classList.add('hidden');
  document.getElementById('authOverlay').classList.remove('hidden');
  document.getElementById('lgUser').value='';
  document.getElementById('lgPass').value='';
  document.getElementById('lgErr').textContent='';
  showTab('login');
}

function checkSession(){
  loadUsers();
  // seed demo account
  if(!users['demo']){users['demo']={username:'demo',name:'Demo Student',email:'demo@studyflow.app',grade:'11th',color:'#7c3aed',password:hashPw('demo123'),joined:today(),active:true,settings:{pomWork:25,pomShort:5,pomLong:15}};saveUsers()}
  const sess=localStorage.getItem(LS_SESSION);
  if(sess&&users[sess]){loginUser(sess)}
}

// ── TOAST ──
function toast(msg,type='info'){
  const c=document.getElementById('toasts');
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.textContent=msg;
  c.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(40px)';t.style.transition='all 0.3s';setTimeout(()=>t.remove(),300)},3200);
}

// ── CONFIRM ──
function openConfirm(title,msg,icon='⚠️',cb){
  document.getElementById('cfmTitle').textContent=title;
  document.getElementById('cfmMsg').textContent=msg;
  document.getElementById('cfmIcon').textContent=icon;
  confirmCb=cb;
  openModal('confirmDlg');
  document.getElementById('cfmOk').onclick=()=>{closeModal('confirmDlg');if(confirmCb)confirmCb()};
}

// ── MODAL ──
function openModal(id){document.getElementById(id).classList.remove('hidden')}
function closeModal(id){document.getElementById(id).classList.add('hidden')}

// ── SIDEBAR / NAV ──
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open')}
function goTo(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const pg=document.getElementById('page-'+page);
  if(pg)pg.classList.add('active');
  const ni=document.getElementById('nav-'+page);
  if(ni)ni.classList.add('active');
  const titles={dashboard:'Dashboard',reminders:'Reminders',flashcards:'Flashcards',notes:'Notes',pomodoro:'Pomodoro Timer',quiz:'Quiz Mode',analytics:'Analytics',ai:'AI Assistant',settings:'Settings'};
  document.getElementById('tbTitle').textContent=titles[page]||page;
  if(page==='dashboard')renderDashboard();
  else if(page==='reminders')renderReminders();
  else if(page==='flashcards')renderDecks();
  else if(page==='notes')renderNotes();
  else if(page==='pomodoro')renderPomStats();
  else if(page==='quiz')renderQuizSetup();
  else if(page==='analytics')renderAnalytics();
  else if(page==='settings')renderSettings();
  document.getElementById('sidebar').classList.remove('open');
}

// ── THEME HEADER ──
function renderTopBar(){
  const u=currentUser;
  const initials=u.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  document.getElementById('tbAvatar').style.background=u.color;
  document.getElementById('tbAvatar').textContent=initials;
  document.getElementById('tbDate').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  document.getElementById('streakNum').textContent=getStreak();
  document.getElementById('sbUser').innerHTML=`
    <div class="sb-avatar" style="background:${u.color}">${initials}</div>
    <div><div class="sb-uname">${esc(u.name)}</div><div class="sb-urole">${esc(u.grade||'Student')}</div></div>`;
}

// ── BADGES ──
function updateBadges(){
  const overdue=(userData.reminders||[]).filter(r=>!r.completed&&isOverdue(r.date,r.time)).length;
  const el=document.getElementById('badge-overdue');
  if(el)el.textContent=overdue||'';
  const now=today();
  const due=(userData.decks||[]).reduce((a,d)=>(d.cards||[]).filter(c=>!c.dueDate||c.dueDate<=now).length+a,0);
  const bd=document.getElementById('badge-due');
  if(bd)bd.textContent=due||'';
}
