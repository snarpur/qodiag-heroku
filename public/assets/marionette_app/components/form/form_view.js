(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Qapp.module("Components.Form", function(Form, App, Backbone, Marionette, $, _) {
    Form.FormWrapper = (function(_super) {
      __extends(FormWrapper, _super);

      function FormWrapper() {
        return FormWrapper.__super__.constructor.apply(this, arguments);
      }

      FormWrapper.prototype.getTemplate = function() {
        if (this.options.config.modal) {
          return "form/modal-form";
        } else {
          return "form/form";
        }
      };

      FormWrapper.prototype.tagName = "form";

      FormWrapper.prototype.className = function() {
        return this.options.config.formClass;
      };

      FormWrapper.prototype.attributes = function() {
        return {
          "data-type": this.getFormDataType()
        };
      };

      FormWrapper.prototype.regions = {
        formContentRegion: "#form-content-region"
      };

      FormWrapper.prototype.ui = {
        buttonContainer: "ul.inline-list"
      };

      FormWrapper.prototype.events = {
        "click button[data-form-button]": "formButtonClick",
        "click button[data-dismiss]": "closeButtonClick",
        "keyup": "keypressed"
      };

      FormWrapper.prototype.formButtonClick = function(event) {
        var buttonType;
        buttonType = $(event.target).attr('data-form-button');
        return this.trigger("form:" + buttonType, {
          sourceButton: buttonType
        });
      };

      FormWrapper.prototype.keypressed = function(e) {
        if (e.which === 13 && e.target.type !== "textarea") {
          return this.trigger("form:submit", {
            collection: false
          });
        }
      };

      FormWrapper.prototype.closeButtonClick = function() {
        return this.trigger("form:cancel");
      };

      FormWrapper.prototype.modelEvents = {
        "sync:start": "syncStart",
        "sync:stop": "syncStop"
      };

      FormWrapper.prototype.initialize = function(options) {
        this.addOpacityWrapper(false);
        return this.setInstancePropertiesFor("config", "buttons");
      };

      FormWrapper.prototype.setFormContentRegion = function(region) {
        return this.region.formContentRegion = region;
      };

      FormWrapper.prototype.serializeData = function() {
        var _ref, _ref1;
        return {
          footer: this.config.footer,
          modal: this.config.modal,
          title: this.config.title || false,
          buttons: (_ref = (_ref1 = this.buttons) != null ? _ref1.toJSON() : void 0) != null ? _ref : false
        };
      };

      FormWrapper.prototype.onShow = function() {
        return _.defer((function(_this) {
          return function() {
            if (_this.config.focusFirstInput) {
              _this.focusFirstInput();
            }
            if (_this.buttons) {
              return _this.buttonPlacement();
            }
          };
        })(this));
      };

      FormWrapper.prototype.buttonPlacement = function() {
        return this.ui.buttonContainer.addClass(this.buttons.placement);
      };

      FormWrapper.prototype.focusFirstInput = function() {
        return this.$el.find('input[type=text],textarea,select').filter(':visible:enabled:first').focus();
      };

      FormWrapper.prototype.getFormDataType = function() {
        if (this.model.isNew()) {
          return "new";
        } else {
          return "edit";
        }
      };

      FormWrapper.prototype.syncStart = function(model) {
        if (this.config.syncing) {
          return this.addOpacityWrapper();
        }
      };

      FormWrapper.prototype.syncStop = function(model) {
        if (this.config.syncing) {
          return this.addOpacityWrapper(false);
        }
      };

      return FormWrapper;

    })(App.Views.Layout);
    Form.FieldView = (function(_super) {
      __extends(FieldView, _super);

      function FieldView() {
        this.optionsChanged = __bind(this.optionsChanged, this);
        this.templateHelpers = __bind(this.templateHelpers, this);
        return FieldView.__super__.constructor.apply(this, arguments);
      }

      FieldView.prototype.initialize = function(options) {
        this.modelIsNew = options["new"];
        return FieldView.__super__.initialize.apply(this, arguments);
      };

      FieldView.prototype.getTemplate = function() {
        return "form/templates/_" + (this.model.get("fieldType")) + "_field";
      };

      FieldView.prototype.onRender = function() {
        if (this.model.get("_errors") != null) {
          return this.changeErrors(this.model, this.model.get("_errors"));
        }
      };

      FieldView.prototype.getLabel = function(option) {
        var label;
        if (option == null) {
          option = null;
        }
        if ((option != null) && (this.model.get("labelKey") != null)) {
          if (_.has(this.model.get("labelKey"), "i18nBase")) {
            return I18n.t(this.model.get("labelKey").i18nBase + "." + option.get("" + (this.model.get("labelKey").key)));
          } else {
            return option.get("" + (this.model.get("labelKey").key));
          }
        } else {
          label = (option != null ? option.get("label") : void 0) != null ? option.get("label") : this.model.get("fieldLabel");
          if (_.has(label, "i18n")) {
            return I18n.t(label.i18n);
          } else {
            return label;
          }
        }
      };

      FieldView.prototype.getValue = function(option) {
        if (option == null) {
          option = null;
        }
        if (option != null) {
          if (this.model.get("valueKey") != null) {
            return option.get("" + (this.model.get("valueKey")));
          } else {
            return option.get("value");
          }
        } else {
          if (this.model.get("valueKey") != null) {
            return this.model.get("valueKey");
          } else {
            return "value";
          }
        }
      };

      FieldView.prototype.templateHelpers = function() {
        return {
          isDisabled: (function(_this) {
            return function() {
              if (!_this.modelIsNew) {
                if (_this.model.get("disabled")) {
                  return "disabled='disabled'";
                }
              }
            };
          })(this),
          label: (function(_this) {
            return function() {
              return _this.getLabel();
            };
          })(this),
          value: (function(_this) {
            return function() {
              return _this.getValue();
            };
          })(this)
        };
      };

      FieldView.prototype.modelEvents = {
        "change:_errors": "changeErrors",
        "change:options": "optionsChanged"
      };

      FieldView.prototype.optionsChanged = function() {};

      FieldView.prototype.changeErrors = function(model, errors, options) {
        this.removeErrors();
        return this.addErrors(errors);
      };

      FieldView.prototype.removeErrors = function() {
        this.$el.removeClass("has-error");
        return this.$el.find(".help-block").text("");
      };

      FieldView.prototype.addErrors = function(errors) {
        var array, name, _results;
        if (errors == null) {
          errors = {};
        }
        _results = [];
        for (name in errors) {
          array = errors[name];
          _results.push(this.addError(name, array));
        }
        return _results;
      };

      FieldView.prototype.addError = function(name, error) {
        var el;
        el = this.$el.find("[id='" + name + "_error']");
        el.closest(".form-group").addClass("has-error");
        return el.text(error);
      };

      FieldView.prototype.onShow = function() {
        this.bindings = {};
        this.bindings["#" + (this.model.get("fieldName"))] = "fieldValue";
        return this.stickit();
      };

      return FieldView;

    })(App.Views.ItemView);
    Form.TextFieldView = (function(_super) {
      __extends(TextFieldView, _super);

      function TextFieldView() {
        return TextFieldView.__super__.constructor.apply(this, arguments);
      }

      TextFieldView.prototype.className = "form-group";

      return TextFieldView;

    })(Form.FieldView);
    Form.HiddenFieldView = (function(_super) {
      __extends(HiddenFieldView, _super);

      function HiddenFieldView() {
        return HiddenFieldView.__super__.constructor.apply(this, arguments);
      }

      return HiddenFieldView;

    })(Form.FieldView);
    Form.TextAreaFieldView = (function(_super) {
      __extends(TextAreaFieldView, _super);

      function TextAreaFieldView() {
        return TextAreaFieldView.__super__.constructor.apply(this, arguments);
      }

      TextAreaFieldView.prototype.className = "form-group";

      return TextAreaFieldView;

    })(Form.FieldView);
    Form.SelectFieldView = (function(_super) {
      __extends(SelectFieldView, _super);

      function SelectFieldView() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        this.optionsChanged = __bind(this.optionsChanged, this);
        return SelectFieldView.__super__.constructor.apply(this, arguments);
      }

      SelectFieldView.prototype.className = "form-group";

      SelectFieldView.prototype.optionsChanged = function() {
        this.render();
        return this.stickit();
      };

      SelectFieldView.prototype.templateHelpers = function() {
        var parent;
        parent = SelectFieldView.__super__.templateHelpers.apply(this, arguments);
        return _.extend(parent, {
          selectOptions: (function(_this) {
            return function() {
              return _this.model.get("options").models;
            };
          })(this),
          label: (function(_this) {
            return function(option) {
              return _this.getLabel(option);
            };
          })(this),
          value: (function(_this) {
            return function(option) {
              return _this.getValue(option);
            };
          })(this)
        });
      };

      return SelectFieldView;

    })(Form.FieldView);
    Form.TitleFieldView = (function(_super) {
      __extends(TitleFieldView, _super);

      function TitleFieldView() {
        return TitleFieldView.__super__.constructor.apply(this, arguments);
      }

      return TitleFieldView;

    })(Form.FieldView);
    Form.SeparatorFieldView = (function(_super) {
      __extends(SeparatorFieldView, _super);

      function SeparatorFieldView() {
        return SeparatorFieldView.__super__.constructor.apply(this, arguments);
      }

      SeparatorFieldView.prototype.className = "col-lg-12";

      SeparatorFieldView.prototype.ui = {
        body: ".panel-body"
      };

      return SeparatorFieldView;

    })(Form.FieldView);
    Form.CheckBoxFieldView = (function(_super) {
      __extends(CheckBoxFieldView, _super);

      function CheckBoxFieldView() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        this.checkboxChange = __bind(this.checkboxChange, this);
        this.getOptions = __bind(this.getOptions, this);
        return CheckBoxFieldView.__super__.constructor.apply(this, arguments);
      }

      CheckBoxFieldView.prototype.className = "form-group";

      CheckBoxFieldView.prototype.events = {
        "change input[type='checkbox']": "checkboxChange"
      };

      CheckBoxFieldView.prototype.getOptions = function() {
        if (this.model.get('conditions') != null) {
          return this.model.get('options').where(this.model.get('conditions'));
        } else {
          return this.model.get("options").models;
        }
      };

      CheckBoxFieldView.prototype.getValue = function(option) {
        var label;
        if (option == null) {
          option = null;
        }
        if (this.model.get("labelKey") != null) {
          return option.get("" + (this.model.get("labelKey").key));
        } else {
          label = (option != null ? option.get("label") : void 0) != null ? option.get("label") : this.model.get("fieldLabel");
          if (_.has(label, "i18n")) {
            return I18n.t(label.i18n);
          } else {
            return label;
          }
        }
      };

      CheckBoxFieldView.prototype.checkboxChange = function(event) {
        var key, modelChecked, query;
        key = this.model.get("labelKey") != null ? this.model.get("labelKey").key : "label";
        query = {};
        query[key] = event.currentTarget.value;
        modelChecked = this.model.get("options").findWhere(query);
        if (modelChecked != null) {
          modelChecked.set("_destroy", !event.currentTarget.checked);
          return modelChecked.set("_status", event.currentTarget.checked);
        }
      };

      CheckBoxFieldView.prototype.templateHelpers = function() {
        var parent;
        parent = CheckBoxFieldView.__super__.templateHelpers.apply(this, arguments);
        return _.extend(parent, {
          checkBoxOptions: (function(_this) {
            return function() {
              return _this.getOptions();
            };
          })(this),
          isChecked: (function(_this) {
            return function(option) {
              if ((option.get("_status") != null) && option.get("_status")) {
                return "checked='checked'";
              }
            };
          })(this),
          label: (function(_this) {
            return function(option) {
              return _this.getLabel(option);
            };
          })(this),
          value: (function(_this) {
            return function(option) {
              return _this.getValue(option);
            };
          })(this)
        });
      };

      return CheckBoxFieldView;

    })(Form.FieldView);
    Form.RadioFieldView = (function(_super) {
      __extends(RadioFieldView, _super);

      function RadioFieldView() {
        return RadioFieldView.__super__.constructor.apply(this, arguments);
      }

      RadioFieldView.prototype.className = "form-group";

      RadioFieldView.prototype.onShow = function() {
        this.bindings = {};
        this.bindings["." + (this.model.get("fieldName"))] = "fieldValue";
        return this.stickit();
      };

      return RadioFieldView;

    })(Form.SelectFieldView);
    Form.DateFieldView = (function(_super) {
      __extends(DateFieldView, _super);

      function DateFieldView() {
        return DateFieldView.__super__.constructor.apply(this, arguments);
      }

      DateFieldView.prototype.className = "form-group";

      DateFieldView.prototype.onShow = function() {
        this.bindings = {};
        this.bindings["#" + (this.model.get("fieldName"))] = {
          observe: "fieldValue",
          onGet: function(value, options) {
            if (value == null) {
              return moment(value, "YYYY-MM-DDTHH:mmZ").format("DD/MM/YY");
            }
          },
          onSet: function(value, options) {
            return moment(value, "DD/MM/YY").format("YY/MM/DD");
          }
        };
        return this.stickit();
      };

      DateFieldView.prototype.ui = function() {
        return {
          datepick: "#" + (this.model.get("fieldName"))
        };
      };

      DateFieldView.prototype.onRender = function() {
        if (this.model.get("fieldType") === "date") {
          this.ui.datepick.datepicker({
            language: I18n.locale,
            autoclose: true,
            forceParse: false,
            format: "dd/mm/yy",
            startDate: new Date().addDays(1),
            todayHighlight: true
          });
        }
        return DateFieldView.__super__.onRender.apply(this, arguments);
      };

      return DateFieldView;

    })(Form.FieldView);
    return Form.FieldCollectionView = (function(_super) {
      __extends(FieldCollectionView, _super);

      function FieldCollectionView() {
        return FieldCollectionView.__super__.constructor.apply(this, arguments);
      }

      FieldCollectionView.prototype.getItemView = function(field) {
        var fieldType;
        if (field != null) {
          if (field.get('fieldClass') == null) {
            fieldType = "" + (_.camelize(_.capitalize(field.get('fieldType')))) + "FieldView";
            return Form[fieldType];
          } else {
            return field.get('fieldClass');
          }
        } else {
          return Form.TextFieldView;
        }
      };

      FieldCollectionView.prototype.itemViewOptions = function() {
        return {
          "new": this.model.isNew()
        };
      };

      FieldCollectionView.prototype.appendHtml = function(collectionView, itemView, index) {
        var type;
        type = itemView.model.get("fieldType");
        if (type === "separator") {
          this.lastSeparator = $(itemView.ui.body);
        }
        if (type !== "separator" && this.lastSeparator) {
          return this.lastSeparator.append(itemView.el);
        } else {
          return collectionView.$el.append(itemView.el);
        }
      };

      return FieldCollectionView;

    })(App.Views.CollectionView);
  });

}).call(this);
