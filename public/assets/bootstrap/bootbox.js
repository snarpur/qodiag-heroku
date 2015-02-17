var bootbox=window.bootbox||function(x,p){function l(b,a){"undefined"===typeof a&&(a=q);return"string"===typeof k[a][b]?k[a][b]:a!=u?l(b,u):b}var q="en",u="en",v=!0,t="static",w="",m={},g={},n={setLocale:function(b){for(var a in k)if(a==b){q=b;return}throw Error("Invalid locale: "+b);},addLocale:function(b,a){"undefined"===typeof k[b]&&(k[b]={});for(var c in a)k[b][c]=a[c]},setIcons:function(b){g=b;if("object"!==typeof g||null===g)g={}},setBtnClasses:function(b){m=b;if("object"!==typeof m||null===
m)m={}},alert:function(){var b="",a=l("OK"),c=null;switch(arguments.length){case 1:b=arguments[0];break;case 2:b=arguments[0];"function"==typeof arguments[1]?c=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];c=arguments[2];break;default:throw Error("Incorrect number of arguments: expected 1-3");}return n.dialog(b,{label:a,icon:g.OK,"class":m.OK,callback:c},{onEscape:c||!0})},confirm:function(){var b="",a=l("CANCEL"),c=l("CONFIRM"),e=null;switch(arguments.length){case 1:b=arguments[0];
break;case 2:b=arguments[0];"function"==typeof arguments[1]?e=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];"function"==typeof arguments[2]?e=arguments[2]:c=arguments[2];break;case 4:b=arguments[0];a=arguments[1];c=arguments[2];e=arguments[3];break;default:throw Error("Incorrect number of arguments: expected 1-4");}var h=function(){if("function"===typeof e)return e(!1)};return n.dialog(b,[{label:a,icon:g.CANCEL,"class":m.CANCEL,callback:h},{label:c,icon:g.CONFIRM,"class":m.CONFIRM,
callback:function(){if("function"===typeof e)return e(!0)}}],{onEscape:h})},prompt:function(){var b="",a=l("CANCEL"),c=l("CONFIRM"),e=null,h="";switch(arguments.length){case 1:b=arguments[0];break;case 2:b=arguments[0];"function"==typeof arguments[1]?e=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];"function"==typeof arguments[2]?e=arguments[2]:c=arguments[2];break;case 4:b=arguments[0];a=arguments[1];c=arguments[2];e=arguments[3];break;case 5:b=arguments[0];a=arguments[1];
c=arguments[2];e=arguments[3];h=arguments[4];break;default:throw Error("Incorrect number of arguments: expected 1-5");}var r=p("<form></form>");r.append("<input autocomplete=off type=text value='"+h+"' />");var h=function(){if("function"===typeof e)return e(null)},d=n.dialog(r,[{label:a,icon:g.CANCEL,"class":m.CANCEL,callback:h},{label:c,icon:g.CONFIRM,"class":m.CONFIRM,callback:function(){if("function"===typeof e)return e(r.find("input[type=text]").val())}}],{header:b,show:!1,onEscape:h});d.on("shown",
function(){r.find("input[type=text]").focus();r.on("submit",function(a){a.preventDefault();d.find(".btn-primary").click()})});d.modal("show");return d},dialog:function(b,a,c){function e(a){a=null;"function"===typeof c.onEscape&&(a=c.onEscape());!1!==a&&f.modal("hide")}var h="",m=[];c||(c={});"undefined"===typeof a?a=[]:"undefined"==typeof a.length&&(a=[a]);for(var d=a.length;d--;){var g=null,l=null,k=null,n="",q=null;if("undefined"==typeof a[d].label&&"undefined"==typeof a[d]["class"]&&"undefined"==
typeof a[d].callback){var g=0,l=null,s;for(s in a[d])if(l=s,1<++g)break;1==g&&"function"==typeof a[d][s]&&(a[d].label=l,a[d].callback=a[d][s])}"function"==typeof a[d].callback&&(q=a[d].callback);a[d]["class"]?k=a[d]["class"]:d==a.length-1&&2>=a.length&&(k="btn-primary");g=a[d].label?a[d].label:"Option "+(d+1);a[d].icon&&(n="<i class='"+a[d].icon+"'></i> ");l=a[d].href?a[d].href:"javascript:;";h="<a data-handler='"+d+"' class='btn "+k+"' href='"+l+"'>"+n+""+g+"</a>"+h;m[d]=q}d=["<div class='bootbox modal' tabindex='-1' style='overflow:hidden;'>"];
if(c.header){k="";if("undefined"==typeof c.headerCloseButton||c.headerCloseButton)k="<a href='javascript:;' class='close'>&times;</a>";d.push("<div class='modal-header'>"+k+"<h3>"+c.header+"</h3></div>")}d.push("<div class='modal-body'></div>");h&&d.push("<div class='modal-footer'>"+h+"</div>");d.push("</div>");var f=p(d.join("\n"));("undefined"===typeof c.animate?v:c.animate)&&f.addClass("fade");(h="undefined"===typeof c.classes?w:c.classes)&&f.addClass(h);f.find(".modal-body").html(b);f.on("keyup.dismiss.modal",
function(a){27===a.which&&c.onEscape&&e("escape")});f.on("click","a.close",function(a){a.preventDefault();e("close")});f.on("shown",function(){f.find("a.btn-primary:first").focus()});f.on("hidden",function(){f.remove()});f.on("click",".modal-footer a",function(b){var c=p(this).data("handler"),d=m[c],e=null;"undefined"!==typeof c&&"undefined"!==typeof a[c].href||(b.preventDefault(),"function"===typeof d&&(e=d()),!1!==e&&f.modal("hide"))});p("body").append(f);f.modal({backdrop:"undefined"===typeof c.backdrop?
t:c.backdrop,keyboard:!1,show:!1});f.on("show",function(a){p(x).off("focusin.modal")});("undefined"===typeof c.show||!0===c.show)&&f.modal("show");return f},modal:function(){var b,a,c,e={onEscape:null,keyboard:!0,backdrop:t};switch(arguments.length){case 1:b=arguments[0];break;case 2:b=arguments[0];"object"==typeof arguments[1]?c=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];c=arguments[2];break;default:throw Error("Incorrect number of arguments: expected 1-3");}e.header=
a;c="object"==typeof c?p.extend(e,c):e;return n.dialog(b,[],c)},hideAll:function(){p(".bootbox").modal("hide")},animate:function(b){v=b},backdrop:function(b){t=b},classes:function(b){w=b}},k={en:{OK:"OK",CANCEL:"Cancel",CONFIRM:"OK"},fr:{OK:"OK",CANCEL:"Annuler",CONFIRM:"D'accord"},de:{OK:"OK",CANCEL:"Abbrechen",CONFIRM:"Akzeptieren"},es:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Aceptar"},br:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Sim"},nl:{OK:"OK",CANCEL:"Annuleren",CONFIRM:"Accepteren"},ru:{OK:"OK",CANCEL:"\u041e\u0442\u043c\u0435\u043d\u0430",
CONFIRM:"\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c"},it:{OK:"OK",CANCEL:"Annulla",CONFIRM:"Conferma"}};return n}(document,window.jQuery);window.bootbox=bootbox;