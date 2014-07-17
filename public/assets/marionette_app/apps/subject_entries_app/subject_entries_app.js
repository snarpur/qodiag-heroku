(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("SubjectEntriesApp", function(SubjectEntriesApp, App, Backbone, Marionette, $, _) {
    var API;
    SubjectEntriesApp.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        "people/:person_id/entries": "list",
        "people/:person_id/entries/:entry_set_response_id(/section/:section_id)": "list"
      };

      return Router;

    })(Marionette.AppRouter);
    API = {
      list: function(personId, entrySetResponseId, sectionId) {
        var args, ctrl, options;
        args = _.map(_.compact(arguments), function(i) {
          return Number(i);
        });
        options = _.object(['personId', 'entrySetResponseId', 'sectionId'], args);
        return ctrl = new SubjectEntriesApp.List.Controller(options);
      },
      create: function(options) {
        var ctrl;
        ctrl = new SubjectEntriesApp.New.Controller(options);
        return ctrl.newEntry();
      },
      show: function(options) {
        var ctrl;
        ctrl = new SubjectEntriesApp.Show.Controller();
        return ctrl.show(options);
      }
    };
    App.commands.setHandler("new:entry:comment", function(options) {
      return API.create(options);
    });
    App.commands.setHandler("show:entry:values", function(options) {
      return API.show(options);
    });
    return App.addInitializer(function() {
      return new SubjectEntriesApp.Router({
        controller: API
      });
    });
  });

}).call(this);
