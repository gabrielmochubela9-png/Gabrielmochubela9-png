var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var mem={};
function load(k,def){try{var v=localStorage.getItem(k);if(v)return JSON.parse(v)}catch(e){}return mem[k]?JSON.parse(mem[k]):def}
function save(k,v){var s=JSON.stringify(v);mem[k]=s;try{localStorage.setItem(k,s)}catch(e){}}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function today(d){var x=new Date();x.setDate(x.getDate()+(d||0));return x.toISOString().slice(0,10)}
function say(t){var l=$('#live');if(l){l.textContent='';setTimeout(function(){l.textContent=t},30)}}
function tabs(names,render){var t=$('#tabs'),cur=0;t.setAttribute('role','tablist');
 function draw(){t.innerHTML=names.map(function(n,i){return'<button role="tab" aria-selected="'+(i===cur)+'" data-i="'+i+'">'+n+'</button>'}).join('');
  $$('button',t).forEach(function(b){b.onclick=function(){cur=+b.dataset.i;draw()}});render(cur)}
 draw();return{go:function(i){cur=i;draw()},redraw:function(){render(cur)}}}
function dl(name,text,type){var b=new Blob([text],{type:type||'text/csv'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},5000)}
function csv(rows){return rows.map(function(r){return r.map(function(c){c=String(c==null?'':c);return/[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(',')}).join('\n')}
