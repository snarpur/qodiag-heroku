(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntryFieldsApp", function(EntryFieldsApp, App, Backbone, Marionette, $, _) {
    var API;
    EntryFieldsApp.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        "settings/entry_fields": "list"
      };

      return Router;

    })(Marionette.AppRouter);
    API = {
      list: function() {
        var ctrl;
        ctrl = new EntryFieldsApp.List.Controller();
        return ctrl.list();
      },
      create: function(options) {
        var ctrl;
        ctrl = new EntryFieldsApp.EditCreate.Controller(options);
        return ctrl.create();
      },
      edit: function(options) {
        var ctrl;
        ctrl = new EntryFieldsApp.EditCreate.Controller(options);
        return ctrl.edit();
      }
    };
    App.commands.setHandler("create:entry:field", function(options) {
      return API.create(options);
    });
    App.commands.setHandler("edit:entry:field", function(options) {
      return API.edit(options);
    });
    return App.addInitializer(function() {
      return new EntryFieldsApp.Router({
        controller: API
      });
    });
  });

}).call(this);
