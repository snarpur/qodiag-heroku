(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntrySetsApp", function(EntrySetsApp, App, Backbone, Marionette, $, _) {
    var API;
    EntrySetsApp.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        "settings/entry_sets": "listEntrySets"
      };

      return Router;

    })(Marionette.AppRouter);
    API = {
      listEntrySets: function(options) {
        var list;
        list = new EntrySetsApp.List.Controller;
        return list.listEntrySets(options);
      },
      "delete": function(options) {
        var list;
        list = new EntrySetsApp.List.Controller(options);
        return list.deleteFromEntrySetSections(options);
      },
      create: function(options) {
        var ctrl;
        ctrl = new EntrySetsApp.EditCreate.Controller(options);
        return ctrl.create();
      },
      edit: function(options) {
        var ctrl;
        ctrl = new EntrySetsApp.EditCreate.Controller(options);
        return ctrl.edit();
      }
    };
    App.commands.setHandler("create:entry:set", function(options) {
      return API.create(options);
    });
    App.commands.setHandler("edit:entry:set", function(options) {
      return API.edit(options);
    });
    App.commands.setHandler("remove:entry_set", function(options) {
      return API["delete"](options);
    });
    return App.addInitializer(function() {
      return new EntrySetsApp.Router({
        controller: API
      });
    });
  });

}).call(this);
