(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("PreRegistrationsApp", function(PreRegistrationsApp, App, Backbone, Marionette, $, _) {
    var API;
    PreRegistrationsApp.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        "pre_registrations/:id(/step/:step_no)": "edit"
      };

      return Router;

    })(Marionette.AppRouter);
    API = {
      edit: function(id, step_no) {
        var ctrl, options;
        options = {
          id: id,
          step: step_no != null ? Number(step_no) : 1
        };
        ctrl = new PreRegistrationsApp.EditCreate.Controller;
        return ctrl.edit(options);
      }
    };
    return App.addInitializer(function() {
      return new PreRegistrationsApp.Router({
        controller: API
      });
    });
  });

}).call(this);
