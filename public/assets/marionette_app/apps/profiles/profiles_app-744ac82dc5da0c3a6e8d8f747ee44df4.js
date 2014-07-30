(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("ProfilesApp", function(ProfilesApp, App, Backbone, Marionette, $, _) {
    var API;
    ProfilesApp.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        "people/:id/profiles": "listProfile"
      };

      return Router;

    })(Marionette.AppRouter);
    API = {
      listProfile: function(subjectId) {
        var list;
        list = new ProfilesApp.List.Controller;
        return list.showProfile(subjectId);
      },
      edit: function(options) {
        var ctrl;
        ctrl = new ProfilesApp.EditCreate.Controller(options);
        return ctrl.edit();
      },
      create: function(options) {
        var ctrl;
        ctrl = new ProfilesApp.EditCreate.Controller(options);
        return ctrl.create();
      }
    };
    App.commands.setHandler("create:guardian", function(options) {
      return API.create(options);
    });
    App.commands.setHandler("edit:guardian", function(options) {
      return API.edit(options);
    });
    return App.addInitializer(function() {
      return new ProfilesApp.Router({
        controller: API
      });
    });
  });

}).call(this);