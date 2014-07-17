(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("InvitationItemsApp", function(InvitationItemsApp, App, Backbone, Marionette, $, _) {
    var API;
    InvitationItemsApp.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        "invitation_items(/:id)/invite/:type(/step/:step_no)": "create"
      };

      return Router;

    })(Marionette.AppRouter);
    API = {
      create: function(id, type, step_no) {
        var ctrl, options;
        options = {
          id: id,
          type: type,
          step: step_no != null ? Number(step_no) : 1
        };
        ctrl = new InvitationItemsApp.EditCreate.Controller;
        if (id != null) {
          return ctrl.edit(options);
        } else {
          return ctrl.create(options);
        }
      }
    };
    return App.addInitializer(function() {
      return new InvitationItemsApp.Router({
        controller: API
      });
    });
  });

}).call(this);
