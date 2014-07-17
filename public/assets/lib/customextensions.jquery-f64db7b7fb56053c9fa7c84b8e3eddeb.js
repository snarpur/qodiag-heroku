(function() {
  $.fn.extend({
    setCssState: function(state, prefix) {
      var cssString, hasState, isStateStr, newState, regexp, setState, settings, updatedCssStr;
      settings = {
        state: '',
        regexp: /^state\-[a-z\-]*/g,
        prefix: 'state-'
      };
      if ((prefix != null) && _.isString(prefix)) {
        regexp = "\^" + (_.trim(prefix, "-")) + "\\-[a-z\-]*";
        settings.regexp = new RegExp(regexp, "g");
        settings.prefix = "" + prefix + "-";
      }
      settings.state = state;
      setState = (function(_this) {
        return function() {
          return _this.attr('class', updatedCssStr());
        };
      })(this);
      updatedCssStr = (function(_this) {
        return function() {
          css;
          var css;
          if (hasState()) {
            css = cssString().replace(hasState(), newState());
          } else {
            css = "" + (cssString()) + " " + (newState());
          }
          return _.trim(css);
        };
      })(this);
      cssString = (function(_this) {
        return function() {
          var _ref;
          return (_ref = _this.attr('class')) != null ? _ref : "";
        };
      })(this);
      isStateStr = (function(_this) {
        return function(str) {
          return str.match(settings.regexp);
        };
      })(this);
      hasState = (function(_this) {
        return function() {
          return _.find(cssString().split(" "), function(str) {
            return _.isArray(str.match(settings.regexp));
          });
        };
      })(this);
      newState = (function(_this) {
        return function() {
          if (_.isBlank(settings.state)) {
            return "";
          } else {
            return "" + settings.prefix + settings.state;
          }
        };
      })(this);
      return this.each(function() {
        return setState(settings);
      });
    },
    cssState: function(prefix) {
      var css, regexp, settings;
      settings = {
        state: '',
        regexp: /^state\-[a-z\-]*/g,
        prefix: 'state-'
      };
      if ((prefix != null) && _.isString(prefix)) {
        regexp = "\^" + (_.trim(prefix, "-")) + "\\-[a-z\-]*";
        settings.regexp = new RegExp(regexp, "g");
        settings.prefix = "" + prefix + "-";
      }
      css = this.attr('class').match(settings.regexp);
      if (css !== null) {
        return css[0].split("-")[1];
      }
    }
  });

}).call(this);
