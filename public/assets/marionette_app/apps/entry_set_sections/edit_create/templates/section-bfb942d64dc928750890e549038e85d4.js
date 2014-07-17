(function() {
  this.JST || (this.JST = {});
  this.JST["marionette_app/apps/entry_set_sections/edit_create/templates/section"] = function(__obj) {
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
        __out.push('<div class="modal" aria-hidden="false" aria-labelledby="myModalLabel" role="dialog" tabindex="-1">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        <h4 class="modal-title">\n          ');
      
        __out.push(this.dialogTitle());
      
        __out.push('\n        </h4>\n      </div>\n      <div class="modal-body">\n        <div class="panel radius">\n          <form class="form-horizontal">\n            <div class="form-group">\n              <label class="col-lg-2 control-label" for="section_name">');
      
        __out.push(__sanitize(this.t("terms.title")));
      
        __out.push('</label>\n              <div class="col-lg-10">\n                <input class="form-control" type="text" id="section_name" placeholder="');
      
        __out.push(__sanitize(this.t("terms.title")));
      
        __out.push('">\n                <span class="help-block" id="section_name_error"></span>\n              </div>\n            </div>\n            <div class="form-group">\n              <label class="col-lg-2  control-label" for="section_description">');
      
        __out.push(__sanitize(this.t("entry_set.description")));
      
        __out.push('</label>\n              <div class="col-lg-10">\n                <textarea class="form-control" rows="3" id="section_description" placeholder="');
      
        __out.push(__sanitize(this.t("entry_set.description")));
      
        __out.push('"></textarea>\n                <span class="help-block" id="section_description_error"></span>\n              </div>\n            </div>\n          </form>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button type="button" data-form-button="submit" class="btn btn-success save">');
      
        __out.push(__sanitize(this.t("actions.save")));
      
        __out.push('</button>\n        <button type="button" data-form-button="cancel" data-dismiss="modal" class="btn btn-default cancel">');
      
        __out.push(__sanitize(this.t("actions.cancel")));
      
        __out.push('</button>\n      </div>\n    </div>\n  </div>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
