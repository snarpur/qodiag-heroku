(function() {
  this.JST || (this.JST = {});
  this.JST["marionette_app/apps/profiles/edit_create/templates/guardian"] = function(__obj) {
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
        __out.push('\n  <div class="control-group">\n    <label class="control-label" for="firstname">');
      
        __out.push(this.t("person.firstname"));
      
        __out.push('</label>\n    <div class="controls">\n      <input class="input-xlarge" type="text" id="firstname" placeholder="');
      
        __out.push(this.t("person.firstname"));
      
        __out.push('">\n      <span id="firstname_error" class="help-inline"></span>\n    </div>\n  </div>\n  <div class="control-group">\n    <label class="control-label" for="lastname">');
      
        __out.push(this.t("person.lastname"));
      
        __out.push('</label>\n    <div class="controls">\n      <input class="input-xlarge" type="text" id="lastname" placeholder="');
      
        __out.push(this.t("person.lastname"));
      
        __out.push('">\n      <span id="lastname_error" class="help-inline"></span>\n    </div>\n  </div>\n  <div class="control-group">\n    <label class="control-label" for="full_cpr">');
      
        __out.push(this.t("person.cpr"));
      
        __out.push('</label>\n    <div class="controls">\n      <input class="input-xlarge" type="text" id="full_cpr" placeholder="');
      
        __out.push(this.t("person.cpr"));
      
        __out.push('">\n      <span id="full_cpr_error" class="help-inline"></span>\n    </div>\n  </div>\n  <div class="control-group">\n   <label class="control-label" for="sex">');
      
        __out.push(this.t("person.sex"));
      
        __out.push('</label>\n    <div class="controls">\n      <label class="radio">\n        <input type="radio" class="sex" name="sex" value="male">\n        ');
      
        __out.push(this.t("person.male"));
      
        __out.push('\n      </label>\n      <label class="radio">\n        <input type="radio" class="sex" name="sex" value="female">\n        ');
      
        __out.push(this.t("person.female"));
      
        __out.push('\n      </label>\n      <span id="sex_error" class="help-inline"></span>\n    </div>\n  </div>\n  <div class="control-group">\n    <label class="control-label" for="street_1">');
      
        __out.push(this.t("address.street_1"));
      
        __out.push('</label>\n    <div class="controls">\n      <input class="input-xlarge" type="text" id="street_1" placeholder="');
      
        __out.push(this.t("address.street_1"));
      
        __out.push('">\n    </div>\n  </div>\n  <div class="control-group">\n    <label class="control-label" for="street_2">');
      
        __out.push(this.t("address.street_2"));
      
        __out.push('</label>\n    <div class="controls">\n      <input class="input-xlarge" type="text" id="street_2" placeholder="');
      
        __out.push(this.t("address.street_2"));
      
        __out.push('">\n    </div>\n  </div>\n  <div class="control-group">\n    <label class="control-label" for="town">');
      
        __out.push(this.t("address.town"));
      
        __out.push('</label>\n    <div class="controls">\n      <input class="input-xlarge" type="text" id="town" placeholder="');
      
        __out.push(this.t("address.town"));
      
        __out.push('">\n    </div>\n  </div>\n  <div class="control-group">\n    <label class="control-label" for="zip_code">');
      
        __out.push(this.t("address.zip_code"));
      
        __out.push('</label>\n    <div class="controls">\n      <input class="input-xlarge" type="text" id="zip_code" placeholder="');
      
        __out.push(this.t("address.zip_code"));
      
        __out.push('">\n    </div>\n  </div>\n  <div class="control-group">\n    <label class="control-label" for="phone">');
      
        __out.push(this.t("address.phone"));
      
        __out.push('</label>\n    <div class="controls">\n      <input class="input-xlarge" type="text" id="phone" placeholder="');
      
        __out.push(this.t("address.phone"));
      
        __out.push('">\n    </div>\n  </div>\n  <div class="control-group">\n    <label class="control-label" for="home_phone">');
      
        __out.push(this.t("address.home_phone"));
      
        __out.push('</label>\n    <div class="controls">\n      <input class="input-xlarge" type="text" id="home_phone" placeholder="');
      
        __out.push(this.t("address.home_phone"));
      
        __out.push('">\n    </div>\n  </div>\n \n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);