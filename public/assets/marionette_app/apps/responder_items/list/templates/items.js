(function() {
  this.JST || (this.JST = {});
  this.JST["marionette_app/apps/responder_items/list/templates/items"] = function(__obj) {
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
        __out.push('<section class="panel">\n  <header class="panel-heading">');
      
        __out.push(__sanitize(this.tableTitle()));
      
        __out.push('</header>\n  <div class="panel-body">\n    <div class="adv-table">\n      <div id="table_wrapper" class="dataTables_wrapperform-inline">\n        <table class="display table table-bordered table-striped dataTable">\n          <thead>\n            <tr>\n              <th>');
      
        __out.push(this.t('terms.name'));
      
        __out.push('</th>\n              <th>');
      
        __out.push(this.t('terms.patient'));
      
        __out.push('</th>\n              <th>');
      
        __out.push(this.t('terms.due_date'));
      
        __out.push('</th>\n            </tr>\n          </thead>\n          <tbody></tbody>\n        </table>\n      </div>\n    </div>\n  </div>\n</section>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
