(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    Entities.Field = (function(_super) {
      __extends(Field, _super);

      function Field() {
        return Field.__super__.constructor.apply(this, arguments);
      }

      Field.prototype.initialize = function() {
        this.setErrors();
        this.addErrorListeners();
        this.addValidateListeners();
        this.setFieldValue();
        this.addFieldValueListeners();
        return Field.__super__.initialize.apply(this, arguments);
      };

      Field.prototype.setErrors = function() {
        return this.set("_errors", this.get("formModel").get("_errors"));
      };

      Field.prototype.addErrorListeners = function() {
        return this.listenTo(this.get("formModel"), 'change:_errors', (function(_this) {
          return function(model, errors) {
            return _this.set("_errors", errors);
          };
        })(this));
      };

      Field.prototype.addValidateListeners = function() {
        return this.listenToOnce(this.get("formModel"), "validated", (function(_this) {
          return function() {
            return _this.on("change:fieldValue", function() {
              return _this.get("formModel").validate(_this.get("fieldName"));
            });
          };
        })(this));
      };

      Field.prototype.setFieldValue = function() {
        return this.set("fieldValue", this.get("formModel").get(this.get("fieldName")));
      };

      Field.prototype.addFieldValueListeners = function() {
        this.on("change:fieldValue", (function(_this) {
          return function() {
            return _this.get("formModel").set(_this.get("fieldName"), _this.get("fieldValue"), {
              changed: _this.get("fieldName")
            });
          };
        })(this));
        return this.listenTo(this.get("formModel"), "change:" + (this.get("fieldName")), (function(_this) {
          return function(model, options) {
            return _this.set("fieldValue", _this.get("formModel").get(_this.get("fieldName")));
          };
        })(this));
      };

      return Field;

    })(Backbone.Model);
    Entities.Field.Separator = (function(_super) {
      __extends(Separator, _super);

      function Separator() {
        return Separator.__super__.constructor.apply(this, arguments);
      }

      return Separator;

    })(Backbone.Model);
    Entities.Field.Title = (function(_super) {
      __extends(Title, _super);

      function Title() {
        return Title.__super__.constructor.apply(this, arguments);
      }

      return Title;

    })(Backbone.Model);
    Entities.Field.Hidden = (function(_super) {
      __extends(Hidden, _super);

      function Hidden() {
        return Hidden.__super__.constructor.apply(this, arguments);
      }

      return Hidden;

    })(Backbone.Model);
    Entities.Field.Date = (function(_super) {
      __extends(Date, _super);

      function Date() {
        return Date.__super__.constructor.apply(this, arguments);
      }

      return Date;

    })(Entities.Field);
    Entities.Field.Select = (function(_super) {
      __extends(Select, _super);

      function Select() {
        return Select.__super__.constructor.apply(this, arguments);
      }

      Select.prototype.initialize = function() {
        var optionsFieldName;
        optionsFieldName = "_" + this.get("fieldName") + "_options";
        this.setOptions(optionsFieldName);
        this.addOptionsListeners(optionsFieldName);
        return Select.__super__.initialize.apply(this, arguments);
      };

      Select.prototype.setOptions = function(optionsFieldName) {
        var options;
        if (this.get("formModel").get(optionsFieldName) != null) {
          options = this.get("formModel").get(optionsFieldName);
        } else {
          options = this.get('options');
        }
        if (!(options instanceof Backbone.Collection)) {
          options = new Backbone.Collection(options);
        }
        return this.set("options", options);
      };

      Select.prototype.addOptionsListeners = function(optionsFieldName) {
        return this.listenTo(this.get("formModel"), "change:" + optionsFieldName, (function(_this) {
          return function(model, options) {
            return _this.set("options", _this.get("formModel").get(optionsFieldName));
          };
        })(this));
      };

      Select.prototype.addFieldValueListeners = function() {
        this.on("change:fieldValue", (function(_this) {
          return function(model, selected, options) {
            var modelSelected;
            modelSelected = _this.get("options").findWhere({
              id: Number(selected)
            });
            return _this.get("formModel").set(_this.get("fieldName"), _this.get("fieldValue"), {
              modelSelected: modelSelected
            });
          };
        })(this));
        return this.listenTo(this.get("formModel"), "change:" + (this.get("fieldName")), (function(_this) {
          return function(model, options) {
            return _this.set("fieldValue", _this.get("formModel").get(_this.get("fieldName")));
          };
        })(this));
      };

      return Select;

    })(Entities.Field);
    Entities.Field.Text = (function(_super) {
      __extends(Text, _super);

      function Text() {
        return Text.__super__.constructor.apply(this, arguments);
      }

      return Text;

    })(Entities.Field);
    Entities.Field.TextArea = (function(_super) {
      __extends(TextArea, _super);

      function TextArea() {
        return TextArea.__super__.constructor.apply(this, arguments);
      }

      return TextArea;

    })(Entities.Field);
    Entities.Field.CheckBox = (function(_super) {
      __extends(CheckBox, _super);

      function CheckBox() {
        return CheckBox.__super__.constructor.apply(this, arguments);
      }

      CheckBox.prototype.initialize = function() {
        var optionsFieldName;
        optionsFieldName = "_" + this.get("fieldName") + "_options";
        this.setOptions(optionsFieldName);
        this.addOptionsListeners(optionsFieldName);
        return CheckBox.__super__.initialize.apply(this, arguments);
      };

      CheckBox.prototype.setOptions = function(optionsFieldName) {
        var options;
        if (this.get("formModel").get(optionsFieldName) != null) {
          options = this.get("formModel").get(optionsFieldName);
        } else if (this.get("options") != null) {
          options = this.get('options');
        } else {
          options = this.get('formModel');
        }
        if (!(options instanceof Backbone.Collection)) {
          options = new Backbone.Collection(options);
        }
        return this.set("options", options);
      };

      CheckBox.prototype.addOptionsListeners = function(optionsFieldName) {
        return this.listenTo(this.get("formModel"), "change:" + optionsFieldName, (function(_this) {
          return function(model, options) {
            return _this.set("options", _this.get("formModel").get(optionsFieldName));
          };
        })(this));
      };

      return CheckBox;

    })(Entities.Field);
    Entities.Field.Radio = (function(_super) {
      __extends(Radio, _super);

      function Radio() {
        return Radio.__super__.constructor.apply(this, arguments);
      }

      return Radio;

    })(Entities.Field.Select);
    Entities.Field.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      return Controller;

    })(Backbone.Model);
    Entities.FieldCollection = (function(_super) {
      __extends(FieldCollection, _super);

      function FieldCollection() {
        return FieldCollection.__super__.constructor.apply(this, arguments);
      }

      FieldCollection.prototype.model = function(attrs, options) {
        var fieldType;
        if (attrs.fieldType != null) {
          fieldType = "" + (_.camelize(_.capitalize(attrs.fieldType)));
          return new Entities.Field[fieldType](attrs, options);
        }
      };

      FieldCollection.prototype.initialize = function(models, options) {
        this.rootModel = options.rootModel, this.controllerModel = options.controllerModel;
        return _.each(models, (function(_this) {
          return function(model) {
            var auxModel, nestedModels;
            if (model.modelName != null) {
              if (model.modelName === "controller") {
                model.formModel = _this.controllerModel;
              } else {
                if (_.isString(model.modelName)) {
                  nestedModels = model.modelName.split(".");
                  auxModel = _this.rootModel;
                  _.each(nestedModels, function(nested) {
                    var formModel;
                    formModel = auxModel.get(nested);
                    return auxModel = formModel;
                  });
                  model.formModel = auxModel;
                }
              }
            } else {
              model.formModel = _this.rootModel;
            }
            if (model.validations != null) {
              return _.each(model.validations, function(validation) {
                return model.formModel.validation["" + model.fieldName] = validation;
              });
            }
          };
        })(this));
      };

      return FieldCollection;

    })(Backbone.Collection);
    return Entities.FormModel = (function() {
      function FormModel() {}

      return FormModel;

    })();
  });

}).call(this);
