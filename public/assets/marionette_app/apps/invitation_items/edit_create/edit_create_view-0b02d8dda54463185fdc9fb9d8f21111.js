(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("InvitationItemsApp.EditCreate", function(EditCreate, App, Backbone, Marionette, $, _) {
    EditCreate.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = "invitation_items/edit_create/templates/layout";

      Layout.prototype.className = "row";

      Layout.prototype.regions = {
        formStepsRegion: "#form-steps-region",
        mainRegion: "#fields-region"
      };

      return Layout;

    })(App.Views.Layout);
    EditCreate.FormStep = (function(_super) {
      __extends(FormStep, _super);

      function FormStep() {
        return FormStep.__super__.constructor.apply(this, arguments);
      }

      FormStep.prototype.template = "invitation_items/edit_create/templates/_form_step";

      FormStep.prototype.tagName = 'li';

      FormStep.prototype.triggers = {
        'click': "change:current:step"
      };

      FormStep.prototype.className = function() {
        if (this.model.isCurrentStep()) {
          return "current-step";
        }
      };

      return FormStep;

    })(App.Views.ItemView);
    return EditCreate.FormSteps = (function(_super) {
      __extends(FormSteps, _super);

      function FormSteps() {
        return FormSteps.__super__.constructor.apply(this, arguments);
      }

      FormSteps.prototype.itemView = EditCreate.FormStep;

      FormSteps.prototype.className = 'stepy-titles clearfix';

      FormSteps.prototype.tagName = 'ul';

      FormSteps.prototype.collectionEvents = {
        'change:current:step': function() {
          return this.render();
        }
      };

      return FormSteps;

    })(App.Views.CollectionView);
  });

}).call(this);
