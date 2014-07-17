(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntryFieldsApp.EditCreate", function(EditCreate, App, Backbone, Marionette, $, _) {
    return EditCreate.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        return this.activeView = options.activeView, this.collection = options.collection, this.model = options.model, options;
      };

      Controller.prototype.create = function() {
        return this.showDialog(new App.Entities.EntryField({
          editable: true,
          field_type: "text"
        }));
      };

      Controller.prototype.edit = function() {
        return this.showDialog(this.model);
      };

      Controller.prototype.showDialog = function(field) {
        this.getFormWrapperView(field);
        this.getSelectFieldTypeView(field);
        this.getSelectedView(field);
        this.listenTo(field, "created", (function(_this) {
          return function(options) {
            _this.addAsSorted(field, _this.collection);
            _this.formView.trigger("dialog:close");
            return toastr.success(I18n.t("entry_set.messages.question_saved"), field.get('title'));
          };
        })(this));
        return this.listenTo(field, "updated", (function(_this) {
          return function(options) {
            return _this.formView.trigger("dialog:close");
          };
        })(this));
      };

      Controller.prototype.getFormWrapperView = function(field) {
        this.formView = App.request("form:wrapper", this.getLayout(field), this.buttonsConfig(field));
        return App.dialogRegion.show(this.formView);
      };

      Controller.prototype.getSelectedView = function(field) {
        if (field.get("field_type") === "text" || field.get("field_type") === "string") {
          return this.getTextFieldView(field);
        } else {
          this.addOptionCollection(field);
          return this.getMultiChoiceFieldView(field);
        }
      };

      Controller.prototype.getSelectFieldTypeView = function(field) {
        var selectView;
        selectView = new EditCreate.FieldType({
          model: field,
          collection: new Backbone.Collection([
            {
              name: "text"
            }, {
              name: "multi-choice"
            }, {
              name: "single-choice"
            }, {
              name: "string"
            }
          ])
        });
        this.getFieldTypeRegion(field).show(selectView);
        return this.listenTo(selectView, "fieldtype:change", (function(_this) {
          return function(options) {
            var value;
            value = options.view.$el.find(":selected").val();
            field.set("field_type", value);
            return _this.getSelectedView(field);
          };
        })(this));
      };

      Controller.prototype.getTextFieldView = function(field) {
        var configView;
        configView = new EditCreate.TextFieldType({
          model: field
        });
        this.getFieldConfig(field).show(configView);
        return field.unset("entry_field_options");
      };

      Controller.prototype.addOptionCollection = function(field) {
        var field_options;
        if (field.get("entry_field_options") == null) {
          field_options = new App.Entities.EntryFieldOptions(new App.Entities.EntryFieldOption({
            text_option: "text"
          }));
          return field.set("entry_field_options", field_options);
        }
      };

      Controller.prototype.getMultiChoiceFieldView = function(field) {
        var configView;
        configView = new EditCreate.MultipleChoiceFieldList({
          model: field,
          collection: field.get("entry_field_options")
        });
        this.getFieldConfig(field).show(configView);
        this.listenTo(configView, "add-option:clicked", (function(_this) {
          return function(view) {
            return view.collection.add(new App.Entities.EntryFieldOption({
              text_option: "text"
            }));
          };
        })(this));
        return this.listenTo(configView, "childview:destroy-option:clicked", (function(_this) {
          return function(view) {
            if (field.get('entry_field_options').size() > 1) {
              return view.model.destroy();
            }
          };
        })(this));
      };

      Controller.prototype.buttonsConfig = function(field) {
        var options;
        options = {
          modal: true,
          title: field.isNew() ? I18n.t("terms.add_information") : I18n.t("terms.edit_information"),
          formClass: "form-horizontal"
        };
        return options;
      };

      Controller.prototype.getFieldTypeRegion = function(field) {
        return this.getLayout(field).fieldTypeRegion;
      };

      Controller.prototype.getFieldConfig = function(field) {
        return this.getLayout(field).fieldConfig;
      };

      Controller.prototype.addAsSorted = function(model, collection) {
        var index, parent;
        parent = collection.getParentCollection();
        index = _.sortedIndex(parent.pluck('title'), model.get('title'));
        parent.add(model, {
          at: index
        });
        return collection.trigger("reset");
      };

      Controller.prototype.getLayout = function(field) {
        return this.layout != null ? this.layout : this.layout = new EditCreate.Layout({
          model: field
        });
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
