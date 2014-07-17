(function() {
  this.JST || (this.JST = {});
  this.JST["marionette_app/apps/entry_fields/edit_create/templates/text_field_type"] = function(__obj) {
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
        __out.push('<div class="form-group">\n  <label class="col-lg-2 control-label" for="title">');
      
        __out.push(__sanitize(this.t("terms.title")));
      
        __out.push('</label>\n  <div class="col-lg-10">\n    <input class="form-control" type="text" id="title" placeholder="');
      
        __out.push(__sanitize(this.t("terms.title")));
      
        __out.push('...">\n    <span id="title_error" class="help-block"></span>\n  </div>\n</div>\n<div class="form-group">\n  <label class="col-lg-2 control-label" for="description">');
      
        __out.push(__sanitize(this.t("entry_set.description")));
      
        __out.push('</label>\n  <div class="col-lg-10">\n    <textarea class="form-control" rows="3" id="description" placeholder="');
      
        __out.push(__sanitize(this.t("entry_set.description")));
      
        __out.push('..."></textarea>\n  </div>\n</div>\n');
      
        if (this.hasRole('caretaker_admin')) {
          __out.push('\n  <div class="form-group">\n    <label class="col-lg-2 control-label" for="visibility"></label>\n    <div class="col-lg-10">\n      <div class="checkbox">\n        <label>\n          <input type="checkbox" id="visibility">\n          ');
          __out.push(__sanitize(this.t("entry_set.public")));
          __out.push('\n        </label>\n      </div>        \n    </div>\n  </div>\n');
        }
      
        __out.push('\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
