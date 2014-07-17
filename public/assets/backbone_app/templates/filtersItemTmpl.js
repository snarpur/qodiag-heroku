(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/filtersItemTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<label>',  I18n.t("surveys.adhd-rating-scale.terms."+name) ,'\n<select class="',  name ,'">\n  ');  for(var i=0; i<options.length; i++) { ; __p.push('\n    <option id = "',  options[i].id ,'" ',  options[i].selected ,'>\n      ', options[i].value ,'\n    </option>\n  ');  } ; __p.push('\n</select> \n</label>\n');}return __p.join('');};
}).call(this);
