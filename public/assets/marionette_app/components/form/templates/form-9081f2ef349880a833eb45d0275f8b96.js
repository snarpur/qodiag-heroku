(function() {
  this.JST || (this.JST = {});
  this.JST["marionette_app/components/form/templates/form"] = function(__obj) {
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
        var button, _i, _len, _ref;
      
        __out.push('\t<div id="form-content-region"></div>\n\t');
      
        if (this.footer) {
          __out.push('\n\t\t\t');
          if (this.buttons) {
            __out.push('\n\t\t\t\t<p class="default-buttons">\n\t\t\t\t\t');
            _ref = this.buttons;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              button = _ref[_i];
              __out.push('\n\t\t\t\t\t\t<button type="button" data-form-button="');
              __out.push(__sanitize(button.buttonType));
              __out.push('" class="');
              __out.push(__sanitize(button.className));
              __out.push('">');
              __out.push(__sanitize(button.text));
              __out.push('</button>\n\t\t\t\t\t');
            }
            __out.push('\n\t\t\t\t</p>\n\t\t\t');
          }
          __out.push('\n\t');
        }
      
        __out.push('\n\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
