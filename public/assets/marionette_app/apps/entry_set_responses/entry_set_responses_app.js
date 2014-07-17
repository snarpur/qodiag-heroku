(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntrySetResponsesApp", function(EntrySetResponsesApp, App, Backbone, Marionette, $, _) {
    var API;
    EntrySetResponsesApp.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        "entry_set_responses/:entry_set_response_id(/section/:section_id)": "edit"
      };

      return Router;

    })(Marionette.AppRouter);
    API = {
      edit: function(entrySetResponseId, sectionId) {
        var options;
        options = _.object(['entrySetResponseId', 'sectionId'], _.map(arguments, function(i) {
          if (i) {
            return Number(i);
          }
        }));
        return new EntrySetResponsesApp.Edit.Controller().edit(options);
      }
    };
    return App.addInitializer(function() {
      return new EntrySetResponsesApp.Router({
        controller: API
      });
    });
  });

}).call(this);
