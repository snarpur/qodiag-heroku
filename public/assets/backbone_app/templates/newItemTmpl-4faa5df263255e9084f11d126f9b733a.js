(function(){this.JST||(this.JST={});this.JST["backbone_app/templates/newItemTmpl"]=function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments)};with(obj||{}){__p.push('<div class="window">\n    <span class="icon-close close"></span>\n    <div class="left">\n      <h3>',I18n.t("surveys."+name+".name"),'</h3>\n      <ul class="state-msg">\n        <li class="m-idle">\n          <div class="alert alert-info">Veldu dagsetningu til að senda beiðni</div>\n        </li>\n        <li class="m-selected"></li>\n        <li class="m-sending"></li>\n        <li class="m-success">\n          <div class="alert alert-block alert-success">\n            <h4>Beiðni hefur verið send</h4>\n             Veldu dagsetningu til að senda aðra beiðni\n          </div>\n        </li>\n        <li class="m-error">\n          <div class="alert alert-block alert-error">\n            <h4>Villa !</h4>\n            Kerfisstjóri hefur fengið meldingu um villu.\n          </div>\n        </li>\n      </ul>\n    </div>\n    <div class="calendar right"></div>\n    <ul class="btn-controls">\n      <button class="btn btn-cancel">Hætta við</button>\n      <button class="btn btn-success btn-submit">Senda</button>\n    </ul>\n</div>\n')}return __p.join("")}}).call(this);