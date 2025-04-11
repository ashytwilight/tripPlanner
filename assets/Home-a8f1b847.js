import{_ as u,u as v,a as w,b as p,o as x,c as g,d as t,n as h,e as s,r as f,f as y,g as i,t as o,w as d,h as _}from"./index-5156d72b.js";const k={class:"flex gap-2 justify-end"},z={__name:"LanguageSwitcher",setup(m){const e=v(),r=w(),{locale:l}=p(),c=a=>{const n=a==="en"?"en":"zh";e.push({path:r.path,query:{...r.query,lang:n},hash:r.hash})};return(a,n)=>(x(),g("div",k,[t("button",{onClick:n[0]||(n[0]=b=>c("en")),class:h(["px-3 py-1 rounded",{"bg-blue-500 text-white":s(l)==="en"}])}," English ",2),t("button",{onClick:n[1]||(n[1]=b=>c("zh")),class:h(["px-3 py-1 rounded",{"bg-blue-500 text-white":s(l)==="zh-TW"}])}," 中文 ",2)]))}},B=u(z,[["__file","LanguageSwitcher.vue"]]),C={class:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10"},L={class:"text-right mb-4"},D={class:"text-center"},S={class:"text-4xl font-bold text-gray-900 mb-8"},$={class:"text-xl text-gray-600 mb-12 max-w-5xl mx-auto"},H={class:"grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"},N={class:"bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"},T={class:"text-2xl font-bold text-gray-800 mb-4"},V={class:"text-gray-600 mb-4 h-[48px]"},q={class:"bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"},E={class:"text-2xl font-bold text-gray-800 mb-4"},R={class:"text-gray-600 mb-4 h-[48px]"},W={__name:"Home",setup(m){const{t:e,locale:r}=p();return f(["zh-TW","en"]),(l,c)=>{const a=y("router-link");return x(),g("div",null,[t("div",C,[t("div",L,[i(B)]),t("div",D,[t("h1",S,o(s(e)("nav.home")),1),t("p",$,o(s(e)("home.homeDescritpion")),1)]),t("div",H,[t("div",N,[t("h2",T,o(s(e)("nav.search")),1),t("p",V,o(s(e)("home.searchDescription")),1),i(a,{to:"/search",class:"inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"},{default:d(()=>[_(o(s(e)("home.searchButton")),1)]),_:1})]),t("div",q,[t("h2",E,o(s(e)("nav.planner")),1),t("p",R,o(s(e)("home.plannerDescription")),1),i(a,{to:"/planner",class:"inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"},{default:d(()=>[_(o(s(e)("home.planButton")),1)]),_:1})])])])])}}},I=u(W,[["__file","Home.vue"]]);export{I as default};
