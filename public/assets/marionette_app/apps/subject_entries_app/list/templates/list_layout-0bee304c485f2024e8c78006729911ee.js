(function(){this.JST||(this.JST={});this.JST["marionette_app/apps/subject_entries_app/list/templates/list_layout"]=function(b){b||(b={});var c=[],e=function(a){return a&&a.ecoSafe?a:"undefined"!==typeof a&&null!=a?d(a):""},f=b.safe,d=b.escape;b.safe=function(a){if(a&&a.ecoSafe)return a;"undefined"!==typeof a&&null!=a||(a="");a=new String(a);a.ecoSafe=!0;return a};d||(d=b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")});(function(){c.push('\n<div class="row">\n  <div class="col-lg-12">\n     <section class="panel">\n        <div class="panel-body">\n          <div class="col-lg-6"> \n            <div class="form-group">\n                <div id="enty-set-select-region" class="col-lg-12"></div>\n            </div>\n          </div>\n          <div class="col-lg-6">\n            <a href=\'#\' class="btn btn-info add-item" data-content="Smelli\u00f0 h\u00e9r til a\u00f0 senda bei\u00f0ni um skr\u00e1ningu uppl\u00fdsinga" data-title="Engar f\u00e6rslur">\n              <i class="fa fa-plus"></i>\n              ');
c.push(e(this.t("views.responder_items.requests.submit")));c.push('\n            </a>\n        </div>\n      </section>\n  </div>\n</div>\n<div class="row">\n\n  <div class="col-lg-12">\n    <section class="panel">\n      <div class="panel-body">\n        <div id="entry-set-sections-region"></div>\n        <div id="entry-set-values-region"></div>\n      </div> \n    </section>\n    \n  </div>\n  \n  \n</div>\n')}).call(b);b.safe=f;b.escape=d;return c.join("")}}).call(this);