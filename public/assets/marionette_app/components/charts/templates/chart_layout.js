(function() {
  this.JST || (this.JST = {});
  this.JST["marionette_app/components/charts/templates/chart_layout"] = function(__obj) {
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
        __out.push('<div class="modal" aria-hidden="false" aria-labelledby="myModalLabel" role="dialog" tabindex="-1">\n  <div class="modal-dialog modal-lg">\n    <div class="modal-content">\n      <div class="modal-header" id="charts-heading-region">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n          \n      </div>\n      <div class="modal-body">\n        <div id="charts-menu-region"></div>\n        <div id="charts-filter-region"></div>\n        <div class="panel radius">\n          <div id="charts-region"></div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
