(function(){this.JST||(this.JST={});this.JST["marionette_app/apps/entry_sets/list/templates/entry_sets"]=function(b){b||(b={});var c=[],e=function(a){return a&&a.ecoSafe?a:"undefined"!==typeof a&&null!=a?d(a):""},f=b.safe,d=b.escape;b.safe=function(a){if(a&&a.ecoSafe)return a;"undefined"!==typeof a&&null!=a||(a="");a=new String(a);a.ecoSafe=!0;return a};d||(d=b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")});(function(){c.push('<div class="row">\n  <div class="col-lg-12">\n    <section class="panel pull-right">\n      <button class="btn btn-info" type="button">\n        <i class="fa fa-plus"></i> \n        ');
c.push(e(this.t("actions.new_list")));c.push('\n      </button>\n    </section>\n  </div>\n</div>\n\n\n<div class="row">\n  <div class="col-lg-12">\n    <section class="panel">\n      <div class="panel-body">\n        <div class="adv-table">\n          <div id="entry_sets_wrapper" class="dataTables_wrapper form-inline">\n            <table id="entry_sets" class="display table table-bordered table-striped dataTable" role="grid">\n              <thead>\n                <tr>\n                  <th>');
c.push(e(this.t("terms.name")));c.push("</th>\n                  <th></th>\n                </tr>\n              <tbody></tbody>\n            </table>\n          </div>\n        </div>\n    </section>\n  </div>\n</div>\n\n")}).call(b);b.safe=f;b.escape=d;return c.join("")}}).call(this);
