// 慢慢小屋 on GitHub Pages: route the app's /api/* calls straight to the eva-mum-api Edge Function.
// The publishable key below is a public, client-safe key (same role as the old anon key); it grants
// nothing by itself — every data call still needs the passphrase session.
(function(){
  var BASE='https://lvwspnjysfyomuszzjay.supabase.co/functions/v1/eva-mum-api/';
  var KEY='sb_publishable_YROUDaSxinrbHH4g7q8gmQ_4za7Ohfj';
  var STORE='eva-mum-session';
  var nativeFetch=window.fetch.bind(window);
  function getToken(){try{return localStorage.getItem(STORE)}catch(e){return null}}
  function setToken(v){try{if(v)localStorage.setItem(STORE,v);else localStorage.removeItem(STORE)}catch(e){}}
  window.fetch=function(input,init){
    var u=typeof input==='string'?input:(input instanceof URL?input.href:null);
    var m=u&&/^(?:https:\/\/ngfranki\.github\.io)?(?:\/eva-mum)?\/api\/([a-z-]+)\/?(\?.*)?$/.exec(u);
    if(!m)return nativeFetch(input,init);
    var opts=Object.assign({},init||{});
    var h=new Headers(opts.headers||{});
    h.set('apikey',KEY);
    var t=getToken();if(t)h.set('x-mum-session',t);
    opts.headers=h;opts.credentials='omit';opts.mode='cors';
    return nativeFetch(BASE+m[1]+(m[2]||''),opts).then(function(r){
      var s=r.headers.get('x-mum-session');
      if(s==='clear')setToken(null);else if(s&&/^[a-f0-9]{64}$/.test(s))setToken(s);
      return r;
    });
  };
})();
