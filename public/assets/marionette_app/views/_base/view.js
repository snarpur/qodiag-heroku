(function() {
  var __slice = [].slice;

  this.Qapp.module("Views", function(Views, App, Backbone, Marionette, $, _) {
    var _remove;
    _remove = Marionette.View.prototype.remove;
    return _.extend(Marionette.View.prototype, {
      addOpacityWrapper: function(init) {
        if (init == null) {
          init = true;
        }
        return this.$el.toggleWrapper({
          className: "opacity"
        }, init);
      },
      setInstancePropertiesFor: function() {
        var args, key, val, _ref, _results;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _ref = _.pick.apply(_, [this.options].concat(__slice.call(args)));
        _results = [];
        for (key in _ref) {
          val = _ref[key];
          _results.push(this[key] = val);
        }
        return _results;
      },
      remove: function() {
        var args, wrapper, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if ((_ref = this.model) != null ? typeof _ref.isDestroyed === "function" ? _ref.isDestroyed() : void 0 : void 0) {
          wrapper = this.$el.toggleWrapper({
            className: "opacity",
            backgroundColor: "rgba(255,0,0,0.7)",
            spinner: false
          });
          wrapper.fadeOut(400, function() {
            return $(this).remove();
          });
          return this.$el.fadeOut(400, (function(_this) {
            return function() {
              return _remove.apply(_this, args);
            };
          })(this));
        } else {
          return _remove.apply(this, args);
        }
      },
      extendTemplateHelpers: function(instanceHelpers) {
        var baseKeys, helpers, instanceKeys;
        instanceKeys = _.keys(instanceHelpers());
        baseKeys = _.keys(Marionette.View.prototype.templateHelpers());
        helpers = _.difference(baseKeys, instanceKeys);
        if (!_.isEmpty(helpers)) {
          return this.templateHelpers = function() {
            return _.extend(instanceHelpers(), _.pick.apply(_, [Marionette.View.prototype.templateHelpers()].concat(__slice.call(helpers))));
          };
        }
      },
      modelEvents: {},
      templateHelpers: function() {
        return {
          routeTo: Routes,
          t: function(path) {
            return I18n.t(path);
          },
          l: function(option, string) {
            return I18n.l(option, string);
          },
          m: function(params) {
            if (params == null) {
              params = [];
            }
            if (_.isEmpty(params)) {
              return moment();
            } else {
              return moment.apply(null, params);
            }
          },
          currentUser: function() {
            return App.request("get:current:user").toJSON({
              acceptsNested: false
            });
          },
          hasRole: function(role) {
            return _.contains(this.currentUser().role_names, role);
          },
          getCSRFToken: function() {
            var token;
            return token = $("meta[name=\"csrf-token\"]").attr("content");
          },
          linkTo: function(name, url, options) {
            var className, _ref;
            if (options == null) {
              options = {};
            }
            _.defaults(options, {
              external: false
            });
            if (options.external !== true && _(url).startsWith("/")) {
              url = url.slice(1);
            }
            if (!options.external) {
              url = "#" + url;
            }
            className = (_ref = options.className) != null ? _ref : '';
            return "<a href='" + url + "' class='" + className + "'>" + (this.escape(name)) + "</a>";
          }
        };
      }
    });
  });

}).call(this);