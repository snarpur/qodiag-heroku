(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Qapp.module("EntryFieldsApp.EditCreate", function(EditCreate, App, Backbone, Marionette, $, _) {
    EditCreate.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = "entry_fields/edit_create/templates/layout";

      Layout.prototype.regions = {
        fieldTypeRegion: "#field-type-region",
        fieldConfig: "#field-config-region"
      };

      return Layout;

    })(App.Views.Layout);
    EditCreate.FieldTypeOption = (function(_super) {
      __extends(FieldTypeOption, _super);

      function FieldTypeOption() {
        return FieldTypeOption.__super__.constructor.apply(this, arguments);
      }

      FieldTypeOption.prototype.template = "entry_fields/edit_create/templates/field_type_options";

      FieldTypeOption.prototype.tagName = "option";

      return FieldTypeOption;

    })(App.Views.ItemView);
    EditCreate.FieldType = (function(_super) {
      __extends(FieldType, _super);

      function FieldType() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        return FieldType.__super__.constructor.apply(this, arguments);
      }

      FieldType.prototype.itemView = EditCreate.FieldTypeOption;

      FieldType.prototype.template = "entry_fields/edit_create/templates/field_type";

      FieldType.prototype.itemViewContainer = "select#field-type";

      FieldType.prototype.templateHelpers = function() {
        return {
          isDisabled: (function(_this) {
            return function() {
              if (_this.model.get('id') != null) {
                return "disabled";
              }
            };
          })(this)
        };
      };

      FieldType.prototype.bindings = {
        '#field-type': 'field_type'
      };

      FieldType.prototype.onShow = function() {
        return this.stickit();
      };

      FieldType.prototype.triggers = {
        "change select": "fieldtype:change"
      };

      return FieldType;

    })(App.Views.CompositeView);
    EditCreate.TextFieldType = (function(_super) {
      __extends(TextFieldType, _super);

      function TextFieldType() {
        return TextFieldType.__super__.constructor.apply(this, arguments);
      }

      TextFieldType.prototype.template = "entry_fields/edit_create/templates/text_field_type";

      TextFieldType.prototype.bindings = {
        '#title': 'title',
        '#description': 'description',
        '#visibility': 'visibility'
      };

      TextFieldType.prototype.onShow = function() {
        return this.stickit();
      };

      return TextFieldType;

    })(App.Views.ItemView);
    EditCreate.MultipleChoiceFieldItem = (function(_super) {
      __extends(MultipleChoiceFieldItem, _super);

      function MultipleChoiceFieldItem() {
        return MultipleChoiceFieldItem.__super__.constructor.apply(this, arguments);
      }

      MultipleChoiceFieldItem.prototype.template = "entry_fields/edit_create/templates/multiple_choice_item";

      MultipleChoiceFieldItem.prototype.triggers = {
        "click .destroy": "destroy-option:clicked"
      };

      MultipleChoiceFieldItem.prototype.bindings = {
        '.text_option': 'text_option'
      };

      MultipleChoiceFieldItem.prototype.onShow = function() {
        return this.stickit();
      };

      return MultipleChoiceFieldItem;

    })(App.Views.ItemView);
    return EditCreate.MultipleChoiceFieldList = (function(_super) {
      __extends(MultipleChoiceFieldList, _super);

      function MultipleChoiceFieldList() {
        return MultipleChoiceFieldList.__super__.constructor.apply(this, arguments);
      }

      MultipleChoiceFieldList.prototype.itemView = EditCreate.MultipleChoiceFieldItem;

      MultipleChoiceFieldList.prototype.template = "entry_fields/edit_create/templates/multiple_choice";

      MultipleChoiceFieldList.prototype.itemViewContainer = ".options";

      MultipleChoiceFieldList.prototype.bindings = {
        '#title': 'title',
        '#description': 'description',
        '#visibility': 'visibility'
      };

      MultipleChoiceFieldList.prototype.onShow = function() {
        return this.stickit();
      };

      MultipleChoiceFieldList.prototype.triggers = {
        "click .add": "add-option:clicked"
      };

      return MultipleChoiceFieldList;

    })(App.Views.CompositeView);
  });

}).call(this);
