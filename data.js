var STAGES=['new','contacted','quoted','won','lost'],PRI=['low','normal','high'],TST=['open','in progress','resolved'],SRC=['Referral','Website','Walk-in','Social media','Other'],CST=['lead','active','inactive'];
var D=load('crm_v1',null);
if(!D){D={customers:[
{id:'c1',name:'Fadeful Barber',contact:'Lwazi Mthembu',email:'bookings@fadeful.example',phone:'071 555 0101',source:'Referral',status:'active',created:today(-60)},
{id:'c2',name:'Dina\'s Décor',contact:'Dina Pretorius',email:'dina@decor.example',phone:'082 555 0102',source:'Website',status:'active',created:today(-30)},
{id:'c3',name:'Ubuntu Fitness',contact:'Sizwe Khumalo',email:'info@ubuntufit.example',phone:'063 555 0103',source:'Social media',status:'lead',created:today(-5)}],
deals:[{id:'d1',cust:'c1',title:'Booking system setup',value:12000,stage:'won',date:today(-55)},
{id:'d2',cust:'c2',title:'Online shop website',value:18500,stage:'quoted',date:today(-10)},
{id:'d3',cust:'c3',title:'Member sign-up app',value:25000,stage:'contacted',date:today(-4)}],
tickets:[{id:'t1',cust:'c1',subject:'Calendar not syncing',priority:'high',status:'open',opened:today(-2)},
{id:'t2',cust:'c2',subject:'Update opening hours',priority:'low',status:'in progress',opened:today(-6)},
{id:'t3',cust:'c1',subject:'Reset staff password',priority:'normal',status:'resolved',opened:today(-20)}],
notes:[{id:'n1',cust:'c3',date:today(-5),text:'First call. Wants a sign-up app for gym members.'},{id:'n2',cust:'c3',date:today(-4),text:'Sent overview and asked for a meeting.'}]};save('crm_v1',D)}
function S(){save('crm_v1',D)}
function R(n){return'R'+(Math.round(n*100)/100).toLocaleString('en-ZA',{minimumFractionDigits:2,maximumFractionDigits:2})}
function cu(id){return D.customers.find(function(c){return c.id===id})}
function nm(id){var c=cu(id);return c?c.name:'Deleted customer'}
function opts(a,sel){return a.map(function(x){return'<option'+(x===sel?' selected':'')+'>'+x+'</option>'}).join('')}
function custOpts(){return D.customers.length?D.customers.map(function(c){return'<option value="'+c.id+'">'+esc(c.name)+'</option>'}).join(''):'<option value="">Add a customer first</option>'}
function dealOpen(d){return d.stage!=='won'&&d.stage!=='lost'}
function tktOpen(t){return t.status!=='resolved'}
function cpill(s){return'<span class="pill '+(s==='active'?'ok':s==='lead'?'warn':'')+'">'+s+'</span>'}
function ppill(p){return'<span class="pill '+(p==='high'?'bad':p==='normal'?'warn':'')+'">'+p+'</span>'}
function tbl(head,rows,empty){return rows.length?'<div class="tw"><table><thead><tr>'+head+'</tr></thead><tbody>'+rows.join('')+'</tbody></table></div>':'<div class="card empty">'+empty+'</div>'}
