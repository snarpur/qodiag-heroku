(function(){var u=this,L=u._,q={},m=Array.prototype,r=Object.prototype,v=m.push,k=m.slice,s=m.concat,n=r.toString,M=r.hasOwnProperty,A=m.forEach,B=m.map,C=m.reduce,D=m.reduceRight,E=m.filter,F=m.every,G=m.some,t=m.indexOf,H=m.lastIndexOf,r=Array.isArray,N=Object.keys,w=Function.prototype.bind,b=function(a){if(a instanceof b)return a;if(!(this instanceof b))return new b(a);this._wrapped=a};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=b),exports._=
b):u._=b;b.VERSION="1.4.4";var l=b.each=b.forEach=function(a,c,d){if(null!=a)if(A&&a.forEach===A)a.forEach(c,d);else if(a.length===+a.length)for(var e=0,f=a.length;e<f&&c.call(d,a[e],e,a)!==q;e++);else for(e in a)if(b.has(a,e)&&c.call(d,a[e],e,a)===q)break};b.map=b.collect=function(a,c,b){var e=[];if(null==a)return e;if(B&&a.map===B)return a.map(c,b);l(a,function(a,h,g){e[e.length]=c.call(b,a,h,g)});return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var f=2<arguments.length;null==a&&(a=[]);if(C&&
a.reduce===C)return e&&(c=b.bind(c,e)),f?a.reduce(c,d):a.reduce(c);l(a,function(a,b,O){f?d=c.call(e,d,a,b,O):(d=a,f=!0)});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){var f=2<arguments.length;null==a&&(a=[]);if(D&&a.reduceRight===D)return e&&(c=b.bind(c,e)),f?a.reduceRight(c,d):a.reduceRight(c);var h=a.length;if(h!==+h)var g=b.keys(a),h=g.length;l(a,function(b,k,l){k=g?g[--h]:--h;f?d=c.call(e,d,a[k],k,l):(d=a[k],f=!0)});
if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.find=b.detect=function(a,c,b){var e;I(a,function(a,h,g){if(c.call(b,a,h,g))return e=a,!0});return e};b.filter=b.select=function(a,c,b){var e=[];if(null==a)return e;if(E&&a.filter===E)return a.filter(c,b);l(a,function(a,h,g){c.call(b,a,h,g)&&(e[e.length]=a)});return e};b.reject=function(a,c,d){return b.filter(a,function(a,b,h){return!c.call(d,a,b,h)},d)};b.every=b.all=function(a,c,d){c||(c=b.identity);var e=!0;if(null==
a)return e;if(F&&a.every===F)return a.every(c,d);l(a,function(a,b,g){if(!(e=e&&c.call(d,a,b,g)))return q});return!!e};var I=b.some=b.any=function(a,c,d){c||(c=b.identity);var e=!1;if(null==a)return e;if(G&&a.some===G)return a.some(c,d);l(a,function(a,b,g){if(e||(e=c.call(d,a,b,g)))return q});return!!e};b.contains=b.include=function(a,c){return null==a?!1:t&&a.indexOf===t?-1!=a.indexOf(c):I(a,function(a){return a===c})};b.invoke=function(a,c){var d=k.call(arguments,2),e=b.isFunction(c);return b.map(a,
function(a){return(e?c:a[c]).apply(a,d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.where=function(a,c,d){return b.isEmpty(c)?d?null:[]:b[d?"find":"filter"](a,function(a){for(var b in c)if(c[b]!==a[b])return!1;return!0})};b.findWhere=function(a,c){return b.where(a,c,!0)};b.max=function(a,c,d){if(!c&&b.isArray(a)&&a[0]===+a[0]&&65535>a.length)return Math.max.apply(Math,a);if(!c&&b.isEmpty(a))return-Infinity;var e={computed:-Infinity,value:-Infinity};l(a,function(a,b,g){b=c?
c.call(d,a,b,g):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a)&&a[0]===+a[0]&&65535>a.length)return Math.min.apply(Math,a);if(!c&&b.isEmpty(a))return Infinity;var e={computed:Infinity,value:Infinity};l(a,function(a,b,g){b=c?c.call(d,a,b,g):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.shuffle=function(a){var c,d=0,e=[];l(a,function(a){c=b.random(d++);e[d-1]=e[c];e[c]=a});return e};var x=function(a){return b.isFunction(a)?a:function(c){return c[a]}};
b.sortBy=function(a,c,d){var e=x(c);return b.pluck(b.map(a,function(a,c,b){return{value:a,index:c,criteria:e.call(d,a,c,b)}}).sort(function(a,c){var b=a.criteria,d=c.criteria;if(b!==d){if(b>d||void 0===b)return 1;if(b<d||void 0===d)return-1}return a.index<c.index?-1:1}),"value")};var J=function(a,c,d,e){var f={},h=x(c||b.identity);l(a,function(c,b){var k=h.call(d,c,b,a);e(f,k,c)});return f};b.groupBy=function(a,c,d){return J(a,c,d,function(a,c,d){(b.has(a,c)?a[c]:a[c]=[]).push(d)})};b.countBy=function(a,
c,d){return J(a,c,d,function(a,c){b.has(a,c)||(a[c]=0);a[c]++})};b.sortedIndex=function(a,c,d,e){d=null==d?b.identity:x(d);c=d.call(e,c);for(var f=0,h=a.length;f<h;){var g=f+h>>>1;d.call(e,a[g])<c?f=g+1:h=g}return f};b.toArray=function(a){return!a?[]:b.isArray(a)?k.call(a):a.length===+a.length?b.map(a,b.identity):b.values(a)};b.size=function(a){return null==a?0:a.length===+a.length?a.length:b.keys(a).length};b.first=b.head=b.take=function(a,c,b){return null==a?void 0:null!=c&&!b?k.call(a,0,c):a[0]};
b.initial=function(a,c,b){return k.call(a,0,a.length-(null==c||b?1:c))};b.last=function(a,c,b){return null==a?void 0:null!=c&&!b?k.call(a,Math.max(a.length-c,0)):a[a.length-1]};b.rest=b.tail=b.drop=function(a,c,b){return k.call(a,null==c||b?1:c)};b.compact=function(a){return b.filter(a,b.identity)};var K=function(a,c,d){l(a,function(a){b.isArray(a)?c?v.apply(d,a):K(a,c,d):d.push(a)});return d};b.flatten=function(a,c){return K(a,c,[])};b.without=function(a){return b.difference(a,k.call(arguments,1))};
b.uniq=b.unique=function(a,c,d,e){b.isFunction(c)&&(e=d,d=c,c=!1);d=d?b.map(a,d,e):a;var f=[],h=[];l(d,function(d,e){if(c?!e||h[h.length-1]!==d:!b.contains(h,d))h.push(d),f.push(a[e])});return f};b.union=function(){return b.uniq(s.apply(m,arguments))};b.intersection=function(a){var c=k.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return 0<=b.indexOf(c,a)})})};b.difference=function(a){var c=s.apply(m,k.call(arguments,1));return b.filter(a,function(a){return!b.contains(c,
a)})};b.zip=function(){for(var a=k.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.object=function(a,c){if(null==a)return{};for(var b={},e=0,f=a.length;e<f;e++)c?b[a[e]]=c[e]:b[a[e][0]]=a[e][1];return b};b.indexOf=function(a,c,d){if(null==a)return-1;var e=0,f=a.length;if(d)if("number"==typeof d)e=0>d?Math.max(0,f+d):d;else return e=b.sortedIndex(a,c),a[e]===c?e:-1;if(t&&a.indexOf===t)return a.indexOf(c,d);for(;e<f;e++)if(a[e]===c)return e;return-1};
b.lastIndexOf=function(a,c,b){if(null==a)return-1;var e=null!=b;if(H&&a.lastIndexOf===H)return e?a.lastIndexOf(c,b):a.lastIndexOf(c);for(b=e?b:a.length;b--;)if(a[b]===c)return b;return-1};b.range=function(a,b,d){1>=arguments.length&&(b=a||0,a=0);d=arguments[2]||1;for(var e=Math.max(Math.ceil((b-a)/d),0),f=0,h=Array(e);f<e;)h[f++]=a,a+=d;return h};b.bind=function(a,b){if(a.bind===w&&w)return w.apply(a,k.call(arguments,1));var d=k.call(arguments,2);return function(){return a.apply(b,d.concat(k.call(arguments)))}};
b.partial=function(a){var b=k.call(arguments,1);return function(){return a.apply(this,b.concat(k.call(arguments)))}};b.bindAll=function(a){var c=k.call(arguments,1);0===c.length&&(c=b.functions(a));l(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var e=c.apply(this,arguments);return b.has(d,e)?d[e]:d[e]=a.apply(this,arguments)}};b.delay=function(a,b){var d=k.call(arguments,2);return setTimeout(function(){return a.apply(null,d)},b)};
b.defer=function(a){return b.delay.apply(b,[a,1].concat(k.call(arguments,1)))};b.throttle=function(a,b){var d,e,f,h,g=0,k=function(){g=new Date;f=null;h=a.apply(d,e)};return function(){var l=new Date,m=b-(l-g);d=this;e=arguments;0>=m?(clearTimeout(f),f=null,g=l,h=a.apply(d,e)):f||(f=setTimeout(k,m));return h}};b.debounce=function(a,b,d){var e,f;return function(){var h=this,g=arguments,k=d&&!e;clearTimeout(e);e=setTimeout(function(){e=null;d||(f=a.apply(h,g))},b);k&&(f=a.apply(h,g));return f}};b.once=
function(a){var b=!1,d;return function(){if(b)return d;b=!0;d=a.apply(this,arguments);a=null;return d}};b.wrap=function(a,b){return function(){var d=[a];v.apply(d,arguments);return b.apply(this,d)}};b.compose=function(){var a=arguments;return function(){for(var b=arguments,d=a.length-1;0<=d;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=function(a,b){return 0>=a?b():function(){if(1>--a)return b.apply(this,arguments)}};b.keys=N||function(a){if(a!==Object(a))throw new TypeError("Invalid object");
var c=[],d;for(d in a)b.has(a,d)&&(c[c.length]=d);return c};b.values=function(a){var c=[],d;for(d in a)b.has(a,d)&&c.push(a[d]);return c};b.pairs=function(a){var c=[],d;for(d in a)b.has(a,d)&&c.push([d,a[d]]);return c};b.invert=function(a){var c={},d;for(d in a)b.has(a,d)&&(c[a[d]]=d);return c};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){l(k.call(arguments,1),function(b){if(b)for(var d in b)a[d]=b[d]});return a};b.pick=
function(a){var b={},d=s.apply(m,k.call(arguments,1));l(d,function(d){d in a&&(b[d]=a[d])});return b};b.omit=function(a){var c={},d=s.apply(m,k.call(arguments,1)),e;for(e in a)b.contains(d,e)||(c[e]=a[e]);return c};b.defaults=function(a){l(k.call(arguments,1),function(b){if(b)for(var d in b)null==a[d]&&(a[d]=b[d])});return a};b.clone=function(a){return!b.isObject(a)?a:b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};var y=function(a,c,d,e){if(a===c)return 0!==a||1/a==1/c;
if(null==a||null==c)return a===c;a instanceof b&&(a=a._wrapped);c instanceof b&&(c=c._wrapped);var f=n.call(a);if(f!=n.call(c))return!1;switch(f){case "[object String]":return a==String(c);case "[object Number]":return a!=+a?c!=+c:0==a?1/a==1/c:a==+c;case "[object Date]":case "[object Boolean]":return+a==+c;case "[object RegExp]":return a.source==c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase}if("object"!=typeof a||"object"!=typeof c)return!1;for(var h=d.length;h--;)if(d[h]==
a)return e[h]==c;d.push(a);e.push(c);var h=0,g=!0;if("[object Array]"==f){if(h=a.length,g=h==c.length)for(;h--&&(g=y(a[h],c[h],d,e)););}else{var f=a.constructor,k=c.constructor;if(f!==k&&(!b.isFunction(f)||!(f instanceof f&&b.isFunction(k)&&k instanceof k)))return!1;for(var l in a)if(b.has(a,l)&&(h++,!(g=b.has(c,l)&&y(a[l],c[l],d,e))))break;if(g){for(l in c)if(b.has(c,l)&&!h--)break;g=!h}}d.pop();e.pop();return g};b.isEqual=function(a,b){return y(a,b,[],[])};b.isEmpty=function(a){if(null==a)return!0;
if(b.isArray(a)||b.isString(a))return 0===a.length;for(var c in a)if(b.has(a,c))return!1;return!0};b.isElement=function(a){return!!(a&&1===a.nodeType)};b.isArray=r||function(a){return"[object Array]"==n.call(a)};b.isObject=function(a){return a===Object(a)};l("Arguments Function String Number Date RegExp".split(" "),function(a){b["is"+a]=function(b){return n.call(b)=="[object "+a+"]"}});b.isArguments(arguments)||(b.isArguments=function(a){return!(!a||!b.has(a,"callee"))});"function"!==typeof/./&&(b.isFunction=
function(a){return"function"===typeof a});b.isFinite=function(a){return isFinite(a)&&!isNaN(parseFloat(a))};b.isNaN=function(a){return b.isNumber(a)&&a!=+a};b.isBoolean=function(a){return!0===a||!1===a||"[object Boolean]"==n.call(a)};b.isNull=function(a){return null===a};b.isUndefined=function(a){return void 0===a};b.has=function(a,b){return M.call(a,b)};b.noConflict=function(){u._=L;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=Array(a),f=0;f<a;f++)e[f]=b.call(d,
f);return e};b.random=function(a,b){null==b&&(b=a,a=0);return a+Math.floor(Math.random()*(b-a+1))};var p={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};p.unescape=b.invert(p.escape);var P={escape:RegExp("["+b.keys(p.escape).join("")+"]","g"),unescape:RegExp("("+b.keys(p.unescape).join("|")+")","g")};b.each(["escape","unescape"],function(a){b[a]=function(b){return null==b?"":(""+b).replace(P[a],function(b){return p[a][b]})}});b.result=function(a,c){if(null==a)return null;
var d=a[c];return b.isFunction(d)?d.call(a):d};b.mixin=function(a){l(b.functions(a),function(c){var d=b[c]=a[c];b.prototype[c]=function(){var a=[this._wrapped];v.apply(a,arguments);a=d.apply(b,a);return this._chain?b(a).chain():a}})};var Q=0;b.uniqueId=function(a){var b=++Q+"";return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var z=/(.)^/,R={"'":"'","\\":"\\","\r":"r","\n":"n","\t":"t","\u2028":"u2028","\u2029":"u2029"},S=/\\|'|\r|\n|\t|\u2028|\u2029/g;
b.template=function(a,c,d){var e;d=b.defaults({},d,b.templateSettings);var f=RegExp([(d.escape||z).source,(d.interpolate||z).source,(d.evaluate||z).source].join("|")+"|$","g"),h=0,g="__p+='";a.replace(f,function(b,c,d,e,f){g+=a.slice(h,f).replace(S,function(a){return"\\"+R[a]});c&&(g+="'+\n((__t=("+c+"))==null?'':_.escape(__t))+\n'");d&&(g+="'+\n((__t=("+d+"))==null?'':__t)+\n'");e&&(g+="';\n"+e+"\n__p+='");h=f+b.length;return b});g+="';\n";d.variable||(g="with(obj||{}){\n"+g+"}\n");g="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+
g+"return __p;\n";try{e=new Function(d.variable||"obj","_",g)}catch(k){throw k.source=g,k;}if(c)return e(c,b);c=function(a){return e.call(this,a,b)};c.source="function("+(d.variable||"obj")+"){\n"+g+"}";return c};b.chain=function(a){return b(a).chain()};b.mixin(b);l("pop push reverse shift sort splice unshift".split(" "),function(a){var c=m[a];b.prototype[a]=function(){var d=this._wrapped;c.apply(d,arguments);("shift"==a||"splice"==a)&&0===d.length&&delete d[0];return this._chain?b(d).chain():d}});
l(["concat","join","slice"],function(a){var c=m[a];b.prototype[a]=function(){var a=c.apply(this._wrapped,arguments);return this._chain?b(a).chain():a}});b.extend(b.prototype,{chain:function(){this._chain=!0;return this},value:function(){return this._wrapped}})}).call(this);
