(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntrySetSectionsApp", function(EntrySetSectionsApp, App, Backbone, Marionette, $, _) {
    var API;
    EntrySetSectionsApp.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        "settings/entry_sets/:entry_set_id/sections(/:section_id)": "list"
      };

      return Router;

    })(Marionette.AppRouter);
    API = {
      list: function(entrySetId, sectionId) {
        var ctrl, options;
        options = {
          entrySetId: Number(entrySetId),
          currentSectionId: sectionId ? Number(sectionId) : void 0
        };
        ctrl = new EntrySetSectionsApp.List.Controller;
        return ctrl.list(options);
      },
      createSection: function(section) {
        return new EntrySetSectionsApp.EditCreate.Controller().create(section);
      },
      editSection: function(section) {
        return new EntrySetSectionsApp.EditCreate.Controller().edit(section);
      }
    };
    App.commands.setHandler("create:section", function(section) {
      return API.createSection(section);
    });
    App.commands.setHandler("edit:section", function(section) {
      return API.editSection(section);
    });
    return App.addInitializer(function() {
      return new EntrySetSectionsApp.Router({
        controller: API
      });
    });
  });

}).call(this);
