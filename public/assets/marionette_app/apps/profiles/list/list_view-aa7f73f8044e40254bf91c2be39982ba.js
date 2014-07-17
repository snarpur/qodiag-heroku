(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("ProfilesApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = "profiles/list/templates/list_layout";

      Layout.prototype.regions = {
        subjectProfileRegion: "#subject-profile-region",
        guardianProfileRegion: "#guardian-profile-region"
      };

      return Layout;

    })(App.Views.Layout);
    List.Subject = (function(_super) {
      __extends(Subject, _super);

      function Subject() {
        return Subject.__super__.constructor.apply(this, arguments);
      }

      Subject.prototype.template = "profiles/list/templates/_subject";

      Subject.prototype.triggers = {
        'click .edit-item': 'edit:subject:clicked'
      };

      return Subject;

    })(App.Views.ItemView);
    List.AdultSubject = (function(_super) {
      __extends(AdultSubject, _super);

      function AdultSubject() {
        return AdultSubject.__super__.constructor.apply(this, arguments);
      }

      AdultSubject.prototype.template = "profiles/list/templates/_adult_subject";

      AdultSubject.prototype.triggers = {
        'click .edit-item': 'edit:subject:clicked'
      };

      return AdultSubject;

    })(App.Views.ItemView);
    List.Guardian = (function(_super) {
      __extends(Guardian, _super);

      function Guardian() {
        return Guardian.__super__.constructor.apply(this, arguments);
      }

      Guardian.prototype.getTemplate = function() {
        var _ref;
        if (((_ref = this.model) != null ? _ref.get('id') : void 0) != null) {
          return "profiles/list/templates/_guardian";
        } else {
          return "profiles/list/templates/_empty_guardian";
        }
      };

      Guardian.prototype.tagName = "div";

      Guardian.prototype.className = "col-lg-6";

      Guardian.prototype.triggers = {
        'click .edit-item': 'edit:guardian:clicked',
        'click .add-guardian': 'create:guardian:clicked'
      };

      return Guardian;

    })(App.Views.ItemView);
    List.Guardians = (function(_super) {
      __extends(Guardians, _super);

      function Guardians() {
        return Guardians.__super__.constructor.apply(this, arguments);
      }

      Guardians.prototype.template = "profiles/list/templates/_guardians";

      Guardians.prototype.itemView = List.Guardian;

      Guardians.prototype.itemViewContainer = "div#foreldrar";

      return Guardians;

    })(App.Views.CompositeView);
    return List.Empty = (function(_super) {
      __extends(Empty, _super);

      function Empty() {
        return Empty.__super__.constructor.apply(this, arguments);
      }

      Empty.prototype.template = "profiles/list/templates/_empty";

      return Empty;

    })(App.Views.ItemView);
  });

}).call(this);
