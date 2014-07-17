(function() {
  this.JST || (this.JST = {});
  this.JST["marionette_app/apps/subject_entries_app/list/templates/list_layout"] = function(__obj) {
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
        __out.push('\n<div class="row">\n  <div class="col-lg-12">\n     <section class="panel">\n        <div class="panel-body">\n          <div class="col-lg-6"> \n            <div class="form-group">\n                <div id="enty-set-select-region" class="col-lg-12"></div>\n            </div>\n          </div>\n          <div class="col-lg-6">\n            <a href=\'#\' class="btn btn-info add-item" data-content="Smellið hér til að senda beiðni um skráningu upplýsinga" data-title="Engar færslur">\n              <i class="fa fa-plus"></i>\n              ');
      
        __out.push(__sanitize(this.t("views.responder_items.requests.submit")));
      
        __out.push('\n            </a>\n        </div>\n      </section>\n  </div>\n</div>\n<div class="row">\n\n  <div class="col-lg-12">\n    <section class="panel">\n      <div class="panel-body">\n        <div id="entry-set-sections-region"></div>\n        <div id="entry-set-values-region"></div>\n      </div> \n    </section>\n    \n  </div>\n  \n  \n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
