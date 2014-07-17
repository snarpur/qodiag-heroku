(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntrySetsApp.List", function(List, App, Backbone, Marionette, $, _) {
    return List.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.getLayout = __bind(this.getLayout, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.listEntrySets = function(options) {
        var entrySetsView;
        this.executeSettingsNavigation();
        App.contentRegion.show(this.getLayout());
        this.entrySets = App.request("entry:sets:entities");
        entrySetsView = this.getEntrySetsView();
        return this.showEntrySets(entrySetsView);
      };

      Controller.prototype.showEntrySets = function(entrySetsView) {
        this.show(entrySetsView, {
          region: this.getLayout().listRegion,
          loading: true
        });
        this.listenTo(entrySetsView, "new:entry:set", (function(_this) {
          return function() {
            return App.execute("create:entry:set", {
              activeView: entrySetsView
            });
          };
        })(this));
        return this.listenTo(entrySetsView, 'entry:set:created', (function(_this) {
          return function(newEntrySet) {
            return App.navigate(_this.newEntrySetPath(newEntrySet), {
              trigger: true
            });
          };
        })(this));
      };

      Controller.prototype.getEntrySetsView = function() {
        var view;
        view = new List.EntrySets({
          collection: this.entrySets
        });
        this.listenTo(view, "childview:delete:entry:set", (function(_this) {
          return function(view) {
            return _this.confirmDelete(view);
          };
        })(this));
        return view;
      };

      Controller.prototype.executeSettingsNavigation = function() {
        return App.execute("show:settings:navigation", {
          iconClass: "fa fa-list-ul",
          i18n: "entry_set.model_name_plural"
        });
      };

      Controller.prototype.deleteFromEntrySetSections = function(options) {
        return bootbox.confirm(I18n.t("activerecord.confirm.messages.deleted", {
          model: options.model.get('name')
        }), function(result) {
          if (result) {
            options.model.destroy();
            return window.location.href = "/#settings/entry_sets";
          }
        });
      };

      Controller.prototype.confirmDelete = function(view) {
        return bootbox.confirm(I18n.t("activerecord.confirm.messages.deleted", {
          model: view.model.get('name')
        }), function(result) {
          if (result) {
            return view.model.destroy();
          }
        });
      };

      Controller.prototype.getLayout = function() {
        return this.layout != null ? this.layout : this.layout = new List.Layout;
      };

      Controller.prototype.newEntrySetPath = function(entrySet) {
        return "settings" + (Routes.entry_set_sections_path(entrySet.get('id')));
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
