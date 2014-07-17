(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Qapp.module("EntrySetResponsesApp.Edit", function(Edit, App, Backbone, Marionette, $, _) {
    Edit.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = "entry_set_responses/edit/templates/layout";

      Layout.prototype.regions = {
        formStepsRegion: "#form-steps-region",
        formWrapperRegion: "#form-wrapper-region"
      };

      return Layout;

    })(App.Views.Layout);
    Edit.FormStep = (function(_super) {
      __extends(FormStep, _super);

      function FormStep() {
        return FormStep.__super__.constructor.apply(this, arguments);
      }

      FormStep.prototype.template = "entry_set_responses/edit/templates/_form_step";

      FormStep.prototype.tagName = 'li';

      FormStep.prototype.triggers = {
        'click': "set:current:section"
      };

      FormStep.prototype.onSetCurrentSection = function() {
        return this.model.trigger("change:current:section", {
          model: this.model
        });
      };

      FormStep.prototype.className = function() {
        if (this.model.isCurrentSection()) {
          return "active";
        }
      };

      return FormStep;

    })(App.Views.ItemView);
    Edit.EmptyStep = (function(_super) {
      __extends(EmptyStep, _super);

      function EmptyStep() {
        return EmptyStep.__super__.constructor.apply(this, arguments);
      }

      EmptyStep.prototype.template = "entry_set_responses/edit/templates/_empty_step";

      EmptyStep.prototype.tagName = 'li';

      return EmptyStep;

    })(App.Views.ItemView);
    Edit.FormSteps = (function(_super) {
      __extends(FormSteps, _super);

      function FormSteps() {
        return FormSteps.__super__.constructor.apply(this, arguments);
      }

      FormSteps.prototype.itemView = Edit.FormStep;

      FormSteps.prototype.emptyView = Edit.EmptyStep;

      FormSteps.prototype.className = 'nav nav-tabs';

      FormSteps.prototype.tagName = 'ul';

      FormSteps.prototype.collectionEvents = {
        'change:current:section': function() {
          return this.render();
        }
      };

      return FormSteps;

    })(App.Views.CollectionView);
    Edit.EntryFieldText = (function(_super) {
      __extends(EntryFieldText, _super);

      function EntryFieldText() {
        return EntryFieldText.__super__.constructor.apply(this, arguments);
      }

      EntryFieldText.prototype.template = "entry_set_responses/edit/templates/_text_entry_field";

      EntryFieldText.prototype.className = "form-group";

      EntryFieldText.prototype.onShow = function(options) {
        this.bindings = {};
        this.bindings["\#text_value_" + (this.model.get('id'))] = {
          observe: 'entry_values',
          onGet: function(value, options) {
            return this.model.get('entry_values').first().get('text_value');
          },
          onSet: function(value, options) {
            this.model.get('entry_values').first().set('text_value', value, {
              silent: true
            });
            return this.model.get('entry_values');
          }
        };
        return this.stickit();
      };

      return EntryFieldText;

    })(App.Views.ItemView);
    Edit.EntryFieldString = (function(_super) {
      __extends(EntryFieldString, _super);

      function EntryFieldString() {
        return EntryFieldString.__super__.constructor.apply(this, arguments);
      }

      EntryFieldString.prototype.template = "entry_set_responses/edit/templates/_string_entry_field";

      EntryFieldString.prototype.className = "form-group";

      EntryFieldString.prototype.onShow = function(options) {
        this.bindings = {};
        this.bindings["\#string_value_" + (this.model.get('id'))] = {
          observe: 'entry_values',
          onGet: function(value, options) {
            return this.model.get('entry_values').first().get('string_value');
          },
          onSet: function(value, options) {
            this.model.get('entry_values').first().set('string_value', value, {
              silent: true
            });
            return this.model.get('entry_values');
          }
        };
        return this.stickit();
      };

      return EntryFieldString;

    })(App.Views.ItemView);
    Edit.EntryFieldMultiChoice = (function(_super) {
      __extends(EntryFieldMultiChoice, _super);

      function EntryFieldMultiChoice() {
        return EntryFieldMultiChoice.__super__.constructor.apply(this, arguments);
      }

      EntryFieldMultiChoice.prototype.template = "entry_set_responses/edit/templates/_multi_choice_entry_field";

      EntryFieldMultiChoice.prototype.className = "form-group";

      EntryFieldMultiChoice.prototype.onBeforeRender = function() {
        return this.addRegion("optionsRegion", "#field-options-" + (this.model.get('id')));
      };

      EntryFieldMultiChoice.prototype.onShow = function() {
        return this.optionsRegion.show(this.getFieldOptionsView());
      };

      EntryFieldMultiChoice.prototype.getFieldOptionsView = function() {
        return this.fieldOptionsView != null ? this.fieldOptionsView : this.fieldOptionsView = new Edit.FieldOptions({
          collection: this.model.get('entry_field_options'),
          selectedIds: this.model.get("entry_values").pluck("entry_field_option_id")
        });
      };

      return EntryFieldMultiChoice;

    })(App.Views.Layout);
    Edit.EntryFieldSingleChoice = (function(_super) {
      __extends(EntryFieldSingleChoice, _super);

      function EntryFieldSingleChoice() {
        this.radioClicked = __bind(this.radioClicked, this);
        return EntryFieldSingleChoice.__super__.constructor.apply(this, arguments);
      }

      EntryFieldSingleChoice.prototype.template = "entry_set_responses/edit/templates/_single_choice_entry_field";

      EntryFieldSingleChoice.prototype.className = "form-group";

      EntryFieldSingleChoice.prototype.events = {
        "click input[type=radio]": "radioClicked"
      };

      EntryFieldSingleChoice.prototype.onShow = function(options) {
        this.bindings = {};
        this.bindings["[name=entry_field_" + (this.model.get('id')) + "]"] = {
          observe: 'entry_values',
          onGet: function(value, options) {
            var _ref, _ref1;
            return Number((_ref = this.model.get('entry_values')) != null ? (_ref1 = _ref.first()) != null ? _ref1.get('entry_field_option_id') : void 0 : void 0);
          },
          onSet: function(value, options) {
            if (this.model.get('entry_values') != null) {
              this.model.get('entry_values').first().set('entry_field_option_id', Number(value), {
                silent: true
              });
            }
            return this.model.get('entry_values');
          }
        };
        return this.stickit();
      };

      EntryFieldSingleChoice.prototype.radioClicked = function(event) {
        var currentUser;
        currentUser = App.request("get:current:user");
        return this.model.trigger("option:selected", this.model, {
          person_id: currentUser.get('person_id'),
          entry_field_option_id: event.currentTarget.value,
          entry_field_id: this.model.get('id')
        });
      };

      return EntryFieldSingleChoice;

    })(App.Views.ItemView);
    Edit.EntryFields = (function(_super) {
      __extends(EntryFields, _super);

      function EntryFields() {
        return EntryFields.__super__.constructor.apply(this, arguments);
      }

      EntryFields.prototype.template = "entry_set_responses/edit/templates/entry_fields";

      EntryFields.prototype.childViewMap = {
        "text": Edit.EntryFieldText,
        "string": Edit.EntryFieldString,
        "multi-choice": Edit.EntryFieldMultiChoice,
        "single-choice": Edit.EntryFieldSingleChoice
      };

      EntryFields.prototype.getItemView = function(options) {
        if (!(options == null)) {
          return this.childViewMap[options.get('field_type')];
        }
      };

      return EntryFields;

    })(App.Views.CompositeView);
    Edit.FieldOption = (function(_super) {
      __extends(FieldOption, _super);

      function FieldOption() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        return FieldOption.__super__.constructor.apply(this, arguments);
      }

      FieldOption.prototype.template = "entry_set_responses/edit/templates/_field_option";

      FieldOption.prototype.tagName = 'div';

      FieldOption.prototype.className = "checkbox";

      FieldOption.prototype.templateHelpers = function() {
        return {
          isChecked: (function(_this) {
            return function() {
              if (_.contains(_this.options.selectedIds, _this.model.id)) {
                return "checked='checked'";
              } else {
                return false;
              }
            };
          })(this)
        };
      };

      FieldOption.prototype.events = {
        "click input[type=checkbox]": "fieldOptionClicked"
      };

      FieldOption.prototype.fieldOptionClicked = function(event) {
        var action, currentUser;
        action = event.currentTarget.checked ? "add" : "remove";
        currentUser = App.request("get:current:user");
        return this.model.collection.trigger("options:" + action, this.model, {
          person_id: currentUser.get('person_id'),
          entry_field_option_id: this.model.id,
          entry_field_id: this.model.get('entry_field_id')
        });
      };

      return FieldOption;

    })(App.Views.ItemView);
    return Edit.FieldOptions = (function(_super) {
      __extends(FieldOptions, _super);

      function FieldOptions() {
        return FieldOptions.__super__.constructor.apply(this, arguments);
      }

      FieldOptions.prototype.itemView = Edit.FieldOption;

      FieldOptions.prototype.itemViewOptions = function() {
        return _.pick(this.options, "selectedIds");
      };

      return FieldOptions;

    })(App.Views.CollectionView);
  });

}).call(this);
