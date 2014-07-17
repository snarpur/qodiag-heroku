(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/timelineTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div id="tml-body">\n  <div id="tml-history">\n    <ul class="reset">\n      ');  for(var i=0; i<years.length; i++) {; __p.push('\n        <li>\n        \t<b>',  years[i] ,'</b>\n        \t<b>',  years[i] ,'</b>\n        \t<p>',  I18n.t("date.abbr_month_names").slice(1,13).join("</p><p>"),'</p>\n        </li>\n      ');  } ; __p.push('\n    </ul>\n  </div>\n</div>\n<div id=\'empty-timeline\'>\n  ',  I18n.t("terms.empty") ,'\n</div>\n');}return __p.join('');};
}).call(this);
