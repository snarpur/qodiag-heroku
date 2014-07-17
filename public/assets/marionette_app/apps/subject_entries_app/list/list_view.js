(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Qapp.module("SubjectEntriesApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Layout = (function(_super) {
      __extends(Layout, _super);

      function Layout() {
        return Layout.__super__.constructor.apply(this, arguments);
      }

      Layout.prototype.template = "subject_entries_app/list/list_layout";

      Layout.prototype.triggers = {
        "click .btn.add-item": "add:item:clicked"
      };

      Layout.prototype.ui = {
        sendRequest: "a.add-item"
      };

      Layout.prototype.regions = {
        entrySetSelectRegion: "#enty-set-select-region",
        entrySetSectionsRegion: "#entry-set-sections-region",
        entrySetValuesRegion: "#entry-set-values-region"
      };

      Layout.prototype.initialize = function() {
        return this.entrySetSelectRegion.on("show", (function(_this) {
          return function(view) {
            if (view.isEmpty()) {
              return _this.ui.sendRequest.popover('show');
            }
          };
        })(this));
      };

      return Layout;

    })(App.Views.Layout);
    List.SelectItem = (function(_super) {
      __extends(SelectItem, _super);

      function SelectItem() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        this.triggerSelectResponse = __bind(this.triggerSelectResponse, this);
        return SelectItem.__super__.constructor.apply(this, arguments);
      }

      SelectItem.prototype.template = "subject_entries_app/list/_select_item";

      SelectItem.prototype.tagName = "option";

      SelectItem.prototype.attributes = function() {
        return {
          "data-attribute-id": this.model.get("id")
        };
      };

      SelectItem.prototype.events = {
        'select': 'triggerSelectResponse'
      };

      SelectItem.prototype.triggerSelectResponse = function(event) {
        if (!(this.model.get("completed") == null)) {
          return this.trigger("select:response", this);
        }
      };

      SelectItem.prototype.templateHelpers = function() {
        return {
          responseDetails: (function(_this) {
            return function() {
              if (_this.model.get('completed')) {
                return I18n.t("terms.time_to_words.submitted") + (": " + (moment(_this.model.get('completed')).format('Do MMMM YYYY')));
              } else if (moment().isSame(moment(_this.model.get('deadline')), 'day')) {
                return I18n.t("responder_item.deadline") + " " + I18n.t("terms.time_to_words.expires") + " " + I18n.t("terms.today");
              } else {
                return I18n.t("responder_item.deadline") + (": " + (moment(_this.model.get('deadline')).fromNow()));
              }
            };
          })(this)
        };
      };

      return SelectItem;

    })(App.Views.ItemView);
    List.SelectItems = (function(_super) {
      __extends(SelectItems, _super);

      function SelectItems() {
        this.triggerSelectResponse = __bind(this.triggerSelectResponse, this);
        return SelectItems.__super__.constructor.apply(this, arguments);
      }

      SelectItems.prototype.template = "subject_entries_app/list/select_items";

      SelectItems.prototype.itemView = List.SelectItem;

      SelectItems.prototype.tagName = "select";

      SelectItems.prototype.className = "form-control";

      SelectItems.prototype.attributes = function() {
        return {
          'disabled': (function(_this) {
            return function() {
              if (_this.isEmpty()) {
                return 'disabled';
              }
            };
          })(this)
        };
      };

      SelectItems.prototype.events = {
        'change': 'triggerSelectResponse'
      };

      SelectItems.prototype.collectionEvents = {
        "add": "triggerAdd"
      };

      SelectItems.prototype.triggerSelectResponse = function(event) {
        return $(event.currentTarget.options[event.currentTarget.selectedIndex]).trigger("select");
      };

      SelectItems.prototype.triggerAdd = function() {
        return this.$el.removeAttr('disabled');
      };

      SelectItems.prototype.appendHtml = function(collectionView, itemView, index) {
        var child;
        child = itemView.model.get('completed') ? 1 : 2;
        return this.$("optgroup:nth-child(" + child + ")").append(itemView.el);
      };

      SelectItems.prototype.isEmpty = function() {
        return this.collection.size() === 0;
      };

      return SelectItems;

    })(App.Views.CompositeView);
    List.Section = (function(_super) {
      __extends(Section, _super);

      function Section() {
        return Section.__super__.constructor.apply(this, arguments);
      }

      Section.prototype.template = "subject_entries_app/list/_section";

      Section.prototype.tagName = "li";

      Section.prototype.className = function() {
        if (this.model.collection.isCurrentSection(this.model)) {
          return "active";
        }
      };

      Section.prototype.triggers = {
        "click ": "set:current:section"
      };

      return Section;

    })(App.Views.ItemView);
    List.Sections = (function(_super) {
      __extends(Sections, _super);

      function Sections() {
        return Sections.__super__.constructor.apply(this, arguments);
      }

      Sections.prototype.itemView = List.Section;

      Sections.prototype.tagName = "ul";

      Sections.prototype.className = "nav nav-tabs";

      Sections.prototype.initialize = function() {
        return this.on("childview:set:current:section", function(view) {
          this.collection.currentSectionId = view.model.id;
          return this.collection.trigger("reset");
        });
      };

      return Sections;

    })(App.Views.CollectionView);
    List.Entry = (function(_super) {
      __extends(Entry, _super);

      function Entry() {
        return Entry.__super__.constructor.apply(this, arguments);
      }

      Entry.prototype.template = "subject_entries_app/list/_entry";

      Entry.prototype.tagName = "section";

      Entry.prototype.className = "panel";

      Entry.prototype.initialize = function() {
        return this.model.set('entryValueRegionName', this.entryValueRegionName());
      };

      Entry.prototype.entryValueRegionName = function() {
        return "entry-value-region-" + this.cid;
      };

      return Entry;

    })(App.Views.ItemView);
    List.EmptyEntry = (function(_super) {
      __extends(EmptyEntry, _super);

      function EmptyEntry() {
        return EmptyEntry.__super__.constructor.apply(this, arguments);
      }

      EmptyEntry.prototype.template = "subject_entries_app/list/_section_empty";

      return EmptyEntry;

    })(App.Views.ItemView);
    return List.Entries = (function(_super) {
      __extends(Entries, _super);

      function Entries() {
        return Entries.__super__.constructor.apply(this, arguments);
      }

      Entries.prototype.itemView = List.Entry;

      Entries.prototype.emptyView = List.EmptyEntry;

      return Entries;

    })(App.Views.CollectionView);
  });

}).call(this);
