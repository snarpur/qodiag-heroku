(function() {
  var __slice = [].slice;

  this.Qapp.module("ModelMixins", function(ModelMixins, App, Backbone, Marionette, $, _) {
    return ModelMixins.NestedValidation = {
      _relationKeys: function() {
        var keys, nested;
        nested = _.pluck(this.relations, "key");
        keys = _.keys(this.attributes);
        return _.intersection(nested, keys);
      },
      _validatedRelations: function() {
        return this._validationRegister != null ? this._validationRegister : this._validationRegister = [];
      },
      _addToValidatedRelations: function(key) {
        return this._validatedRelations().push(key);
      },
      _isValidWithNested: function() {
        return !((this.get("_errors") != null) || (this.get("_nestedErrors") != null));
      },
      _errorsWithNested: function() {
        var errors, nestedErrors;
        errors = this.get("_errors") != null ? _.clone(this.get("_errors")) : {};
        nestedErrors = this.get("_nestedErrors") != null ? _.clone(this.get("_nestedErrors")) : {};
        return _.extend(errors, nestedErrors);
      },
      _setNestedErrors: function(model, key, listener) {
        var errors, nestedErrors, _ref;
        nestedErrors = (_ref = this.get("_nestedErrors")) != null ? _ref : {};
        errors = {};
        if (model instanceof Backbone.Collection) {
          _.each(model.models, (function(_this) {
            return function(m) {
              if (!m._isValidWithNested()) {
                return _.extend(errors[key], m._errorsWithNested());
              }
            };
          })(this));
        } else {
          if (!model._isValidWithNested()) {
            errors[key] = model._errorsWithNested();
          }
        }
        if (!_.isEmpty(errors[key])) {
          nestedErrors = _.extend(nestedErrors, errors);
          return this.set("_nestedErrors", nestedErrors);
        }
      },
      validateNested: function() {
        var relations;
        this.set("_nestedErrors", null, {
          silent: true
        });
        relations = this._relationKeys();
        if (_.isEmpty(relations)) {
          return this.isValid(true);
        } else {
          return _.each(relations, (function(_this) {
            return function(m) {
              var nestedConfig, nestedModel, validationListener;
              nestedModel = _this.get(m);
              nestedConfig = _.findWhere(_this.relations, {
                key: m
              });
              validationListener = nestedConfig.type === "Many" ? "validated:" + m + ":collection" : "validated:" + m + ".invalid validated:" + m + ".valid";
              nestedModel.parentRelationsKey = m;
              _this.once(validationListener, function(model, msg, options) {
                _this._setNestedErrors(model, m, validationListener);
                _this._addToValidatedRelations(m);
                if (_.isEmpty(_.difference(_this._relationKeys(), _this._validatedRelations()))) {
                  return _this.isValid(true);
                }
              });
              return nestedModel.validateNested();
            };
          })(this));
        }
      },
      setNestedServerErrors: function(errors) {
        var modelErrors, nestedErrors;
        nestedErrors = {};
        modelErrors = {};
        errors = _.omit.apply(_, [errors].concat(__slice.call(this._relationKeys())));
        _.each(errors, (function(_this) {
          return function(v, k) {
            var keys, _name;
            keys = k.split(".");
            if (keys.length === 1) {
              return modelErrors[k] = v;
            } else {
              if (nestedErrors[_name = keys[0]] == null) {
                nestedErrors[_name] = {};
              }
              if (keys.length === 2) {
                nestedErrors[keys[0]][keys[1]] = v;
              }
              if (keys.length >= 3) {
                return nestedErrors[keys[0]][keys.slice(1).join(".")] = v;
              }
            }
          };
        })(this));
        if (!_.isEmpty(modelErrors)) {
          this.set("_errors", modelErrors);
        }
        if (!_.isEmpty(nestedErrors)) {
          this.set("_nestedErrors", nestedErrors);
        }
        return _.each(nestedErrors, (function(_this) {
          return function(v, k) {
            return _this.get(k).setNestedServerErrors(nestedErrors[k]);
          };
        })(this));
      }
    };
  });

}).call(this);
