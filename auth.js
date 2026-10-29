var AUTH_KEY="crm";
(function(){
var K='auth_'+AUTH_KEY,SK='sess_'+AUTH_KEY,me=null,lock=0,lockUntil=0;
var enc=new TextEncoder();
function b64(u){var s='';u=new Uint8Array(u);for(var i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s)}
function unb64(s){var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
async function hash(pw,salt){
 var key=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);
 return b64(await crypto.subtle.deriveBits({name:'PBKDF2',salt:salt,iterations:100000,hash:'SHA-256'},key,256))}
function users(){return load(K,[])}
function saveUsers(u){save(K,u)}
function sess(){try{return sessionStorage.getItem(SK)}catch(e){return mem[SK]||null}}
function setSess(v){try{if(v)sessionStorage.setItem(SK,v);else sessionStorage.removeItem(SK)}catch(e){mem[SK]=v||null}}
async function mk(name,pw,role){var salt=crypto.getRandomValues(new Uint8Array(16));return{name:name,key:name.toLowerCase(),salt:b64(salt),hash:await hash(pw,salt),role:role,made:today()}}
async function check(u,pw){return await hash(pw,unb64(u.salt))===u.hash}
var css=document.createElement('style');
css.textContent='#authov{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem;background:radial-gradient(50rem 26rem at 90% -5%,rgba(201,168,76,.15),transparent 60%),#070605;overflow:auto}'+
'.authbox{width:100%;max-width:25rem;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:1.4rem;box-shadow:0 20px 60px rgba(0,0,0,.6)}.authbox h2{font-size:1.35rem;margin:0 0 .2rem}.authbox p{margin:0 0 1rem;color:var(--muted);font-size:.9rem}.authbox form{display:grid;gap:.75rem}.authbox .tabs{margin-bottom:1rem}'+
'#authbar{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;justify-content:flex-end;padding:.5rem 1.1rem;border-bottom:1px solid var(--line);background:#0b0907;font-size:.88rem;color:var(--muted)}#authbar b{color:var(--ink)}#authbar .sp{flex:1}'+
'.role-staff .del{display:none!important}#authmod{position:fixed;inset:0;z-index:900;background:rgba(0,0,0,.7);display:flex;align-items:flex-start;justify-content:center;padding:1rem;overflow:auto}#authmod .authbox{max-width:40rem;margin-top:2rem}'+
'@media print{#authbar,#authov,#authmod{display:none!important}}';
document.head.appendChild(css);
function app(on){var w=$('.w');if(w){w.inert=!on;w.setAttribute('aria-hidden',on?'false':'true')}}
function gate(){
 var us=users(),ov=document.createElement('div');ov.id='authov';app(false);
 var mode=us.length?'in':'up';
 function draw(){
  ov.innerHTML='<div class="authbox" role="dialog" aria-modal="true" aria-labelledby="ah"><h2 id="ah">'+esc(document.title)+'</h2><p>'+(mode==='in'?'Sign in to continue.':(us.length?'Create a staff account.':'Create the first account. It will be the administrator.'))+'</p>'+
  (us.length?'<div class="tabs" role="tablist"><button role="tab" aria-selected="'+(mode==='in')+'" data-m="in">Sign in</button><button role="tab" aria-selected="'+(mode==='up')+'" data-m="up">Create account</button></div>':'')+
  '<form id="af"><label>Username<input name="u" autocomplete="username" required minlength="3" maxlength="24" pattern="[A-Za-z0-9._\\-]+" title="Letters, numbers, dot, dash and underscore"></label><label>Password<input name="p" type="password" autocomplete="'+(mode==='in'?'current-password':'new-password')+'" required minlength="6"></label>'+
  (mode==='up'?'<label>Confirm password<input name="c" type="password" autocomplete="new-password" required minlength="6"></label>':'')+
  '<button class="btn go">'+(mode==='in'?'Sign in':'Create account')+'</button></form><p class="err" id="ae" role="alert" style="margin:.6rem 0 0"></p>'+
  '<div style="margin-top:.6rem;padding-top:.8rem;border-top:1px solid var(--line)"><button class="btn" id="demo" style="width:100%">Try the demo account</button><p class="note" style="margin:.6rem 0 0">Accounts and data are stored in this browser only. Nothing is sent to a server.</p></div></div>';
  $$('[data-m]',ov).forEach(function(b){b.onclick=function(){mode=b.dataset.m;draw()}});
  var f=$('#af');f.elements.u.focus();
  f.onsubmit=async function(e){e.preventDefault();var E=f.elements,n=E.u.value.trim(),p=E.p.value,er=$('#ae');er.textContent='';
   if(!window.crypto||!crypto.subtle){er.textContent='This browser cannot hash passwords securely. Use a current browser over HTTPS.';return}
   var all=users(),k=n.toLowerCase();
   if(mode==='in'){
    if(Date.now()<lockUntil){er.textContent='Too many attempts. Wait '+Math.ceil((lockUntil-Date.now())/1000)+' seconds.';return}
    var u=all.find(function(x){return x.key===k});
    if(!u||!(await check(u,p))){lock++;if(lock>=5){lockUntil=Date.now()+30000;lock=0}er.textContent='Wrong username or password.';return}
    lock=0;enter(u)}
   else{
    if(all.some(function(x){return x.key===k})){er.textContent='That username is taken.';return}
    if(p!==E.c.value){er.textContent='The passwords do not match.';return}
    var real=all.filter(function(x){return!x.demo}).length;
    var nu=await mk(n,p,real===0?'admin':'staff');all.push(nu);saveUsers(all);enter(nu)}};
  $('#demo').onclick=async function(){var all=users(),u=all.find(function(x){return x.key==='demo'});
   if(!u){u=await mk('demo','demo1234','admin');u.demo=true;all.push(u);saveUsers(all)}enter(u)}}
 function enter(u){me=u;setSess(u.key);ov.remove();app(true);bar();say('Signed in as '+u.name)}
 document.body.appendChild(ov);draw()}
function bar(){
 var b=$('#authbar');if(!b){b=document.createElement('div');b.id='authbar';document.body.insertBefore(b,document.body.firstChild)}
 document.body.classList.toggle('role-staff',me.role!=='admin');
 b.innerHTML='<span>Signed in as <b>'+esc(me.name)+'</b> <span class="pill">'+(me.role==='admin'?'Administrator':'Staff')+'</span></span><span class="sp"></span><button class="btn sm" id="bpw">Change password</button>'+(me.role==='admin'?'<button class="btn sm" id="bus">Manage users</button>':'')+'<button class="btn sm" id="bout">Log out</button>';
 $('#bout').onclick=function(){setSess(null);me=null;b.remove();document.body.classList.remove('role-staff');gate()};
 $('#bpw').onclick=function(){modal('pw')};var bu=$('#bus');if(bu)bu.onclick=function(){modal('users')}}
function modal(kind){
 var m=document.createElement('div');m.id='authmod';
 function close(){m.remove();var b=$('#authbar');if(b){var x=$(kind==='pw'?'#bpw':'#bus');if(x)x.focus()}}
 function draw(){
  if(kind==='pw'){m.innerHTML='<div class="authbox" role="dialog" aria-modal="true" aria-labelledby="mh"><h2 id="mh">Change password</h2><p>Signed in as '+esc(me.name)+'.</p><form id="mf"><label>Current password<input name="o" type="password" autocomplete="current-password" required></label><label>New password<input name="n" type="password" autocomplete="new-password" required minlength="6"></label><div class="row" style="margin:0"><button class="btn go">Save password</button><button type="button" class="btn" id="mc">Cancel</button></div></form><p class="err" id="me" role="alert" style="margin:.6rem 0 0"></p></div>';
   $('#mc').onclick=close;var f=$('#mf');f.elements.o.focus();
   f.onsubmit=async function(e){e.preventDefault();var all=users(),u=all.find(function(x){return x.key===me.key});
    if(!(await check(u,f.elements.o.value))){$('#me').textContent='Current password is wrong.';return}
    var salt=crypto.getRandomValues(new Uint8Array(16));u.salt=b64(salt);u.hash=await hash(f.elements.n.value,salt);saveUsers(all);me=u;say('Password changed');close()}}
  else{var all=users();
   m.innerHTML='<div class="authbox" role="dialog" aria-modal="true" aria-labelledby="mh"><h2 id="mh">Manage users</h2><p>Administrators can add staff, change roles and remove accounts. Staff cannot delete records.</p><div class="tw"><table><thead><tr><th>User</th><th>Role</th><th></th></tr></thead><tbody>'+all.map(function(u){var self=u.key===me.key;return'<tr><td>'+esc(u.name)+(self?' (you)':'')+'</td><td><select data-r="'+u.key+'" aria-label="Role for '+esc(u.name)+'"'+(self?' disabled':'')+'><option value="admin"'+(u.role==='admin'?' selected':'')+'>Administrator</option><option value="staff"'+(u.role==='staff'?' selected':'')+'>Staff</option></select></td><td class="r">'+(self?'':'<button class="btn sm del2" data-x="'+u.key+'" aria-label="Remove '+esc(u.name)+'">Remove</button>')+'</td></tr>'}).join('')+'</tbody></table></div>'+
   '<h2 style="margin-top:1.2rem;font-size:1rem">Add a user</h2><form class="g" id="mf"><label>Username<input name="u" required minlength="3" maxlength="24" pattern="[A-Za-z0-9._\\-]+"></label><label>Password<input name="p" type="password" required minlength="6" autocomplete="new-password"></label><label>Role<select name="r"><option value="staff">Staff</option><option value="admin">Administrator</option></select></label><button class="btn go">Add user</button></form><p class="err" id="me" role="alert"></p><div class="row" style="margin:0"><button class="btn" id="mc">Close</button></div></div>';
   $('#mc').onclick=close;
   $$('[data-r]',m).forEach(function(s){s.onchange=function(){var a=users();a.find(function(x){return x.key===s.dataset.r}).role=s.value;saveUsers(a);say('Role updated')}});
   $$('[data-x]',m).forEach(function(b){b.onclick=function(){if(confirm('Remove this user?')){saveUsers(users().filter(function(x){return x.key!==b.dataset.x}));draw()}}});
   var f=$('#mf');f.onsubmit=async function(e){e.preventDefault();var E=f.elements,n=E.u.value.trim(),a=users();
    if(a.some(function(x){return x.key===n.toLowerCase()})){$('#me').textContent='That username is taken.';return}
    a.push(await mk(n,E.p.value,E.r.value));saveUsers(a);say('User added');draw()}}}
 document.body.appendChild(m);draw();
 m.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 m.addEventListener('click',function(e){if(e.target===m)close()})}
// boot: restore session or gate
var s=sess(),u=s&&users().find(function(x){return x.key===s});
if(u){me=u;bar()}else gate();
})();
