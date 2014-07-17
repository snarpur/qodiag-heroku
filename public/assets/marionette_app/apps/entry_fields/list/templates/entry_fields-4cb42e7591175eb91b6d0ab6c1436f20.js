(function() {
  this.JST || (this.JST = {});
  this.JST["marionette_app/apps/entry_fields/list/templates/entry_fields"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        __out.push('<div class="row">\n  <div class="col-lg-12">\n    <section class="panel pull-right">\n      <button class="btn btn-info add-question" type="button">\n        <i class="fa fa-plus"></i> \n        ');
      
        __out.push(__sanitize(this.t("actions.new_question")));
      
        __out.push('\n      </button>\n    </section>\n  </div>\n</div>\n\n<div class="row">\n  <div class="col-lg-12">\n    <section class="panel">\n      <div class="panel-body">\n        <div class="adv-table">\n          <div id="entry_fields_wrapper" class="dataTables_wrapper form-inline">\n            <table id="entry_fields" class="display table table-bordered table-striped dataTable" role="grid">\n              <thead>\n                <tr>\n                  <th>');
      
        __out.push(__sanitize(this.t("terms.type")));
      
        __out.push('</th>\n                  <th>');
      
        __out.push(__sanitize(this.t("terms.question")));
      
        __out.push('</th>\n                  <th></th>\n                </tr>\n              <tbody></tbody>\n            </table>\n          </div>\n        </div>\n      </div>\n    </section>\n  </div>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
