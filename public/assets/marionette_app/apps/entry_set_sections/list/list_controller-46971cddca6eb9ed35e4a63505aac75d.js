(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntrySetSectionsApp.List", function(List, App, Backbone, Marionette, $, _) {
    return List.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.list = function(options) {
        return this.getEntrySet(options);
      };

      Controller.prototype.showSidebarOnce = function() {
        return this.getEntryFieldsRegion().on("show", (function(_this) {
          return function(region) {
            return _this.executeSidebar({
              droppableCollection: region.model.collection,
              droppableElement: region.$itemViewContainer
            });
          };
        })(this));
      };

      Controller.prototype.getEntrySet = function(options) {
        var entrySet;
        entrySet = App.request("entry:set:entity", {
          id: options.entrySetId
        });
        return App.execute("when:fetched", entrySet, (function(_this) {
          return function() {
            App.contentRegion.show(_this.getLayout(entrySet));
            window.sectionregion = _this.getSectionContentRegion();
            _this.showSidebarOnce();
            _this.showEntrySetTitle(entrySet);
            _this.executeSettingsNavigation();
            return _this.getSections(_.extend(options, {
              entrySet: entrySet
            }));
          };
        })(this));
      };

      Controller.prototype.getSections = function(options) {
        var sections;
        sections = App.request("entry:set:sections:entities", options);
        return App.execute("when:fetched", sections, (function(_this) {
          return function() {
            var section;
            section = sections.getCurrentSection();
            _this.showSectionsNavigation(sections, options.entrySet);
            if (sections.length !== 0) {
              return _this.executeFields({
                model: sections.getCurrentSection()
              });
            } else {

            }
          };
        })(this));
      };

      Controller.prototype.executeFields = function(options) {
        App.execute("show:settings:section:fields", _.extend(options, {
          region: this.getSectionContentRegion(),
          loaderRegion: this.getEntryFieldsRegion()
        }));
        return this.showTitle(options.model);
      };

      Controller.prototype.executeSidebar = function(options) {
        return App.execute("show:settings:sidebar:fields", _.extend(options, {
          region: this.getSidebarRegion()
        }));
      };

      Controller.prototype.showSectionsNavigation = function(sections, entrySet) {
        var view;
        view = this.getNavigationView(sections);
        this.show(view, {
          region: this.getNavigationRegion(),
          loading: false
        });
        this.listenTo(sections, "change:current:section", (function(_this) {
          return function(options) {
            _this.executeFields(options);
            return App.navigate(_this.sectionUrl(options.model), {
              replace: true
            });
          };
        })(this));
        return this.listenTo(view, "add:new:section:clicked", (function(_this) {
          return function(view) {
            return App.execute("create:section", {
              entrySet: entrySet,
              section: view.collection.newSection(),
              collection: view.collection,
              activeView: _this.getLayout()
            });
          };
        })(this));
      };

      Controller.prototype.showTitle = function(section) {
        var view;
        view = new List.Title({
          model: section
        });
        this.show(view, {
          region: this.getLayout().sectionTitleRegion,
          loading: {
            loadingType: "opacity"
          }
        });
        return this.listenTo(view, "edit:title", (function(_this) {
          return function(options) {
            return App.execute("edit:section", {
              section: options.model,
              activeView: _this.getLayout()
            });
          };
        })(this));
      };

      Controller.prototype.showEntrySetTitle = function(entrySet) {
        var view;
        view = new List.Title({
          model: entrySet
        });
        this.show(view, {
          region: this.getLayout().entrySetTitleRegion,
          loading: false
        });
        this.listenTo(view, "edit:title", (function(_this) {
          return function(options) {
            return App.execute("edit:entry:set", {
              model: entrySet,
              activeView: view
            });
          };
        })(this));
        return this.listenTo(view, "remove:title", (function(_this) {
          return function(options) {
            return App.execute("remove:entry_set", {
              model: entrySet
            });
          };
        })(this));
      };

      Controller.prototype.executeSettingsNavigation = function() {
        return App.execute("show:settings:navigation", {
          iconClass: "fa fa-cogs",
          i18n: "terms.setup"
        });
      };

      Controller.prototype.getNavigationView = function(collection) {
        return new List.SectionsNav({
          collection: collection,
          model: collection.getCurrentSection()
        });
      };

      Controller.prototype.getNavigationRegion = function() {
        return this.getLayout().navigationRegion;
      };

      Controller.prototype.getSectionContentRegion = function() {
        return this.getLayout().sectionContentRegion;
      };

      Controller.prototype.getSidebarRegion = function() {
        return this.getLayout().entryFieldsSidebarRegion;
      };

      Controller.prototype.getEntryFieldsRegion = function() {
        return this.getLayout().entryFieldsRegion;
      };

      Controller.prototype.getLayout = function(entrySet) {
        return this.layout != null ? this.layout : this.layout = new List.Layout({
          model: entrySet
        });
      };

      Controller.prototype.sectionUrl = function(section) {
        var params;
        params = _.values(section.pick("entry_set_id", "id"));
        return "settings" + (Routes.entry_set_section_path.apply(Routes, params));
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
