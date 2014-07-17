(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("SubjectEntriesApp.List", function(List, App, Backbone, Marionette, $, _) {
    return List.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.person = App.request("get:person:entity", options.personId);
        App.execute("when:fetched", this.person, (function(_this) {
          return function() {
            return App.execute("show:subject:navigation", {
              person: _this.person,
              personId: options.personId,
              currentItemName: 'entries'
            });
          };
        })(this));
        return this.list(options);
      };

      Controller.prototype.list = function(options) {
        var entrySetResponseId, sectionId;
        this.personId = options.personId, entrySetResponseId = options.entrySetResponseId, sectionId = options.sectionId;
        this.showLayout(this.items);
        this.items = App.request("get:person:entry:set:responder:items", options);
        return App.execute("when:fetched", this.items, (function(_this) {
          return function() {
            var currentItem;
            _this.showEntrySetSelect(_this.items);
            if (_this.items.size() !== 0) {
              currentItem = entrySetResponseId ? _this.items.where({
                entry_set_response_id: entrySetResponseId
              })[0] : _this.items.first();
              if (!(currentItem.get("completed") == null)) {
                _this.getSections(currentItem, sectionId);
              }
            } else {

            }
            return _this.listenTo(_this.getLayout(), "add:item:clicked", function() {
              return _this.createItemSetup({
                collection: _this.items
              });
            });
          };
        })(this));
      };

      Controller.prototype.getSections = function(currentItem, sectionId) {
        var options, sections;
        options = {
          entrySetId: currentItem.get("entry_set_response").get('entry_set_id'),
          entrySetResponse: currentItem.get("entry_set_response"),
          currentSectionId: sectionId
        };
        sections = App.request("entry:set:sections:entities", options);
        return App.execute("when:fetched", sections, (function(_this) {
          return function() {
            _this.showSections(sections, sections.getCurrentSection().id);
            return _this.getEntries(sections.getCurrentSection());
          };
        })(this));
      };

      Controller.prototype.getEntries = function(section) {
        var entries;
        entries = section.getSectionEntryResponses();
        entries.comparator = 'display_order';
        return App.execute("when:fetched", entries, (function(_this) {
          return function() {
            return _this.showEntryFields(entries);
          };
        })(this));
      };

      Controller.prototype.showEntrySetSelect = function(items) {
        var selectView;
        selectView = new List.SelectItems({
          collection: items,
          layout: this.getLayout()
        });
        this.show(selectView, {
          region: this.getEntrySetSelectRegion(),
          loading: false
        });
        return this.listenTo(selectView, "childview:select:response", (function(_this) {
          return function(view) {
            return _this.getSections(view.model);
          };
        })(this));
      };

      Controller.prototype.showSections = function(sections, currentSectionId) {
        var sectionsView;
        sectionsView = new List.Sections({
          collection: sections
        });
        this.listenTo(sectionsView, "childview:set:current:section", (function(_this) {
          return function(view) {
            _this.getEntries(view.model);
            return App.navigate(_this.entriesUrl(view.model), {
              replace: false
            });
          };
        })(this));
        return this.show(sectionsView, {
          region: this.getSectionRegion(),
          loading: false
        });
      };

      Controller.prototype.showEntryFields = function(entries) {
        var entriesView;
        entriesView = new List.Entries({
          collection: entries
        });
        entriesView.on("childview:show", (function(_this) {
          return function(view) {
            var region;
            region = _this.layout.addRegion(view.entryValueRegionName(), "\#" + (view.entryValueRegionName()));
            return App.execute("show:entry:values", {
              region: region,
              entryField: view.model,
              entries: entries
            });
          };
        })(this));
        return this.show(entriesView, {
          loading: true,
          region: this.getEntrySetValuesRegion()
        });
      };

      Controller.prototype.createItemSetup = function(options) {
        var view;
        if (options == null) {
          options = {};
        }
        return view = App.request("create:responder:item:view", options);
      };

      Controller.prototype.getEntrySetValuesRegion = function() {
        return this.getLayout().entrySetValuesRegion;
      };

      Controller.prototype.getEntrySetSelectRegion = function() {
        return this.getLayout().entrySetSelectRegion;
      };

      Controller.prototype.getSectionRegion = function() {
        return this.getLayout().entrySetSectionsRegion;
      };

      Controller.prototype.showLayout = function(items) {
        return App.request("default:region").show(this.getLayout());
      };

      Controller.prototype.getLayout = function() {
        return this.layout != null ? this.layout : this.layout = new List.Layout;
      };

      Controller.prototype.entriesUrl = function(entry) {
        return _("" + (Routes.person_path(this.personId)) + "/entries/" + (entry.get('entrySetResponseId')) + "/section/" + entry.id).ltrim('/');
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
