(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/newItemTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="window">\n    <span class="icon-close close"></span>\n    <div class="left">\n      <h3>',  I18n.t("surveys."+name+".name"),'</h3>\n      <ul class="state-msg">\n        <li class="m-idle">\n          <div class="alert alert-info">Veldu dagsetningu til að senda beiðni</div>\n        </li>\n        <li class="m-selected"></li>\n        <li class="m-sending"></li>\n        <li class="m-success">\n          <div class="alert alert-block alert-success">\n            <h4>',  I18n.t("views.responder_items.requests.have_sent") ,'</h4>\n            ',  I18n.t("views.responder_items.requests.sent_another") ,'\n          </div>\n        </li>\n        <li class="m-error">\n          <div class="alert alert-block alert-error">\n            <h4>',  I18n.t("views.responder_items.requests.error") ,'</h4>\n            ',  I18n.t("views.responder_items.requests.contact_admin") ,'\n          </div>\n        </li>\n      </ul>\n    </div>\n    <div class="calendar right"></div>\n    <ul class="btn-controls">\n      <button class="btn btn-cancel">',  I18n.t("actions.cancel") ,'</button>\n      <button class="btn btn-success btn-submit">',  I18n.t("actions.send") ,'</button>\n    </ul>\n</div>\n');}return __p.join('');};
}).call(this);