// ===== DATA =====
const PEOPLE = [
  'GADDAM / NIKHITHA REDD','ALLENKI / KEERTHI','KOLIPYAKA / KALYANRE','MANDE / DINESH KUMAR','ADHULA / SRIKANTH',
  'ANKENAPALLY / ABHISH','JAIDI / SEVIKA','NAREDLA / VAISHNAVI','VALLAKONDA / PRASHAN','JAIDI / TEJASWI REDDY',
  'CHINNOLLA / CHARANRE','PATLOORI / SRINIKA','SANDEEP','PRUDHVI','LAMBU / SRIJA','NAKKALA / VIVEK REDDY','VELPOOR / THIRUMALA'
];
const state = { votes: Object.fromEntries(PEOPLE.map(n => [n, null])) };
const pillId = (name) => `pill-${CSS.escape(name)}`;

// ===== NAVIGATION =====
function show(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const tgt = document.getElementById(id);
  if (tgt) tgt.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
}

// Handle both click and touch events for better mobile experience
function handleNavigation(e) {
  const btn = e.target.closest('[data-nav]');
  if(btn && !btn.disabled) {
    e.preventDefault();
    show(btn.dataset.nav);
  }
}

document.addEventListener('click', handleNavigation);
document.addEventListener('touchend', handleNavigation);

// ===== LANDING GATE (4 checkboxes must be checked) =====
(function initGate(){
  const checks = [...document.querySelectorAll('.gate-check')];
  const btn = document.getElementById('landingContinue');
  const evaluate = () => { btn.disabled = !checks.every(c => c.checked); };
  checks.forEach(c => c.addEventListener('change', evaluate));
  evaluate();
})();

// ===== PARTICIPANTS =====
const grid = document.getElementById('peopleGrid');
const statusPill = document.getElementById('statusPill');

function renderPeople(){
  grid.innerHTML='';
  Object.entries(state.votes).forEach(([name,val])=>{
    const el = document.createElement('div');
    el.className='card';
    el.innerHTML = `
      <div class="name">${name}</div>
      <div class="muted">Choose a response</div>
      <div class="actions">
        <button class="btn sm ok" type="button">Interested</button>
        <button class="btn sm no" type="button">Not Interested</button>
      </div>
      <div class="pill ${val===true?'ok':val===false?'no':''}" id="${pillId(name)}" style="margin-top:8px;${val===null?'display:none':''}">
        ${val===true?'Interested ✅':val===false?'Not Interested ✖':''}
      </div>`;
    const [okBtn,noBtn] = el.querySelectorAll('button');
    okBtn.onclick = ()=> vote(name, true);
    noBtn.onclick = ()=> vote(name, false);
    grid.appendChild(el);
  });
  updateStatus();
}

function vote(name, val){
  state.votes[name] = val;
  const pill = document.getElementById(pillId(name));
  if(pill){
    pill.style.display = 'inline-flex';
    pill.className = 'pill ' + (val ? 'ok' : 'no');
    pill.textContent = val ? 'Interested ✅' : 'Not Interested ✖';
  }
  updateStatus();
}

function updateStatus(){
  const vals = Object.values(state.votes);
  const yes = vals.filter(v=>v===true).length;
  const no  = vals.filter(v=>v===false).length;
  const pending = vals.filter(v=>v===null).length;
  statusPill.textContent = `${yes} Interested • ${no} Not • ${pending} Pending`;
}

// Submit → Contacts
document.getElementById('submitVotes').addEventListener('click',()=> show('contacts'));

// ===== LOGIC GATE =====
document.getElementById('checkLogic').addEventListener('click',()=>{
  const firstNo = Object.entries(state.votes).find(([,v])=>v===false);
  const anyPending = Object.values(state.votes).some(v=>v===null);
  if(firstNo){
    alert(`${firstNo[0]} is not interested. To see the roadmap, everyone must select “Interested”.`);
    show('participants'); return;
  }
  if(anyPending){
    alert('Some responses are still pending. Please select for everyone.');
    show('participants'); return;
  }
  // All good → start at Day 1
  show('day1');
});

// ===== BOOT =====
renderPeople();
