(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/multistepFormNavigationTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<li class=', cssClass,'>\n  <span>', stepNo,'</span>\n  '); if(formModelId == null) {; __p.push('\n    <a href="#">\n      ',  stepName,'\n    </a>\n  '); }else{; __p.push('\n    <a href=', "#step/s"+stepNo +"/i"+ formModelId,'>\n      ',  stepName,'\n    </a>\n  '); }; __p.push('\n</li>\n');}return __p.join('');};
}).call(this);