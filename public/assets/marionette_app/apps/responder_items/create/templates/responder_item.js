(function() {
  this.JST || (this.JST = {});
  this.JST["marionette_app/apps/responder_items/create/templates/responder_item"] = function(__obj) {
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
        var entrySet, respondent, _i, _j, _len, _len1, _ref, _ref1;
      
        __out.push('<div class="control-group">\n  <label for="respondent_id" class="control-label">');
      
        __out.push(this.t("responder_item.respondent"));
      
        __out.push('</label>\n  <div class="controls">\n    <span class="help-inline span1"></span>\n    <select id="respondent_id" class="input-xlarge">\n      <option value="">');
      
        __out.push(__sanitize(this.t("views.responder_items.select_respondents")));
      
        __out.push('</option>\n      ');
      
        if (this.respondents() != null) {
          __out.push('\n        ');
          _ref = this.respondents();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            respondent = _ref[_i];
            __out.push('\n          <option value="');
            __out.push(__sanitize(respondent.id));
            __out.push('">');
            __out.push(__sanitize(respondent.full_name));
            __out.push('</option> \n        ');
          }
          __out.push('\n      ');
        }
      
        __out.push('\n    </select>\n    <span id="respondent_id_error" class="help-inline"></span>\n  </div>\n</div>\n<div class="control-group">\n  <label for="entry_set_response" class="control-label">');
      
        __out.push(this.t("responder_item.entry_set"));
      
        __out.push('</label>\n  <div class="controls">\n    <select id="entry_set_response" data-nested-key="entry_set_id" class="input-xlarge">\n      <option value="">');
      
        __out.push(__sanitize(this.t("views.responder_items.select_entry_sets")));
      
        __out.push('</option>\n      ');
      
        if (this.entrySets() != null) {
          __out.push('\n        ');
          _ref1 = this.entrySets();
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            entrySet = _ref1[_j];
            __out.push('\n          <option value="');
            __out.push(__sanitize(entrySet.id));
            __out.push('">');
            __out.push(__sanitize(entrySet.name));
            __out.push('</option> \n        ');
          }
          __out.push('\n      ');
        }
      
        __out.push('\n    </select>\n    <span id="entry_set_response_error" class="help-inline"></span>\n  </div>\n</div>\n\n\n  <div class="control-group">\n    <label class="control-label">');
      
        __out.push(this.t("responder_item.deadline"));
      
        __out.push('</label>\n    <div class="controls">\n      <label for="deadline_date"></label>\n      <span id="deadline_error" class="help-inline"></span>\n    </div>\n  </div>\n\n\n<div class="row">\n    <div id="deadline" class="span5 offset1" data-date-wrapper=\'true\'>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
