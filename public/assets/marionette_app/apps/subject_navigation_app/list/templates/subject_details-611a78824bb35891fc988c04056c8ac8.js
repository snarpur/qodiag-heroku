(function() {
  this.JST || (this.JST = {});
  this.JST["marionette_app/apps/subject_navigation_app/list/templates/subject_details"] = function(__obj) {
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
        __out.push('<div class="alt user-heading">\n  <a href="/people/');
      
        __out.push(__sanitize(this.id));
      
        __out.push('" >\n    <img src="');
      
        __out.push(__sanitize(this.image_url_small));
      
        __out.push('">\n  </a>\n  <h1 class="content_title_sub">');
      
        __out.push(__sanitize(this.firstname + " " + this.lastname));
      
        __out.push('</h1>\n  <p>');
      
        __out.push(this.age);
      
        __out.push('  ');
      
        __out.push(__sanitize(this.t("surveys.terms.age")));
      
        __out.push('</p>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
