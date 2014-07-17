(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Qapp.module("SubjectNavigationApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = "subject_navigation_app/list/list_layout";

      Layout.prototype.regions = {
        subjectDetailsRegion: "#subject-details-region",
        subjectNavigationRegion: "#subject-navigation-region"
      };

      return Layout;

    })(App.Views.Layout);
    List.SubjectDetails = (function(_super) {
      __extends(SubjectDetails, _super);

      function SubjectDetails() {
        return SubjectDetails.__super__.constructor.apply(this, arguments);
      }

      SubjectDetails.prototype.template = "subject_navigation_app/list/subject_details";

      SubjectDetails.prototype.className = "profile-nav";

      SubjectDetails.prototype.tagName = "div";

      return SubjectDetails;

    })(App.Views.ItemView);
    List.Item = (function(_super) {
      __extends(Item, _super);

      function Item() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        return Item.__super__.constructor.apply(this, arguments);
      }

      Item.prototype.template = "subject_navigation_app/list/_item";

      Item.prototype.tagName = 'li';

      Item.prototype.className = "col-lg-4";

      Item.prototype.templateHelpers = function() {
        return {
          selected: (function(_this) {
            return function() {
              if (_this.model.isActive()) {
                return 'text-primary';
              }
            };
          })(this)
        };
      };

      return Item;

    })(App.Views.ItemView);
    return List.Navigation = (function(_super) {
      __extends(Navigation, _super);

      function Navigation() {
        return Navigation.__super__.constructor.apply(this, arguments);
      }

      Navigation.prototype.itemView = List.Item;

      Navigation.prototype.tagName = "ul";

      Navigation.prototype.className = "summary-list";

      return Navigation;

    })(App.Views.CollectionView);
  });

}).call(this);
