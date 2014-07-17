(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/lineItemTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<ul class="reset">\n<li><em>', I18n.t("views.responder_items.requests.sent") ,': ',  I18n.strftime(new Date(created_at),"%-d %B %Y"),'</em></li>\n<li><em>',  I18n.t("terms.due_date") ,': ',  I18n.strftime(new Date(deadline),"%-d %B %Y") ,'</em></li>\n</ul>\n');}return __p.join('');};
}).call(this);
