(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/newItemMsgTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="alert alert-block alert-info">\n  <h4>',  I18n.t("views.responder_items.requests.for", {date:""}) ,':</h4>\n  ', I18n.strftime(date,"%A %-d %B %Y"),'\n  ',  I18n.t("terms.ago") ,'\n</div>\n');}return __p.join('');};
}).call(this);
