(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.EntrySetSection = (function(_super) {
      __extends(EntrySetSection, _super);

      function EntrySetSection() {
        return EntrySetSection.__super__.constructor.apply(this, arguments);
      }

      EntrySetSection.prototype.paramRoot = 'section';

      EntrySetSection.prototype.blacklist = ['entry_set_id', 'display_order'];

      EntrySetSection.prototype.nestedAttributeList = ['sections_entry_fields', 'entry_sets_sections'];

      EntrySetSection.prototype.initialize = function() {
        var _ref, _ref1, _ref2;
        if ((((_ref = this.collection) != null ? _ref.entrySetResponseId : void 0) != null) || (((_ref1 = this.collection) != null ? _ref1.entrySetResponse : void 0) != null)) {
          this.set("entrySetResponseId", (_ref2 = this.collection.entrySetResponseId) != null ? _ref2 : this.collection.entrySetResponse.id);
        }
        return this.url = function() {
          if (this.isNew()) {
            return Routes.sections_path();
          } else {
            return Routes.section_path(this.get('id'));
          }
        };
      };

      EntrySetSection.prototype.getSectionEntryResponses = function() {
        var entries;
        entries = new App.Entities.EntryFields([], {});
        entries.url = Routes.entry_set_response_section_path(this.get('entrySetResponseId'), this.id);
        entries.fetch({
          reset: true
        });
        return entries;
      };

      EntrySetSection.prototype.getSectionEntryFields = function(callback) {
        var entryFields;
        entryFields = new App.Entities.SectionsEntryFieldsCollection([], {
          section: this
        });
        this.set('sections_entry_fields', entryFields);
        if (!this.isNew()) {
          entryFields.fetch({
            reset: true
          });
        }
        return entryFields;
      };

      EntrySetSection.prototype.addSelectedField = function(options) {
        var displayOrder, field, fields, model;
        displayOrder = options.displayOrder, field = options.field;
        model = {
          entry_field_id: field.get('id'),
          section_id: this.get('id'),
          display_order: displayOrder,
          entry_field: field.toJSON()
        };
        fields = this.get("sections_entry_fields");
        return fields.add([model], {
          at: displayOrder
        });
      };

      EntrySetSection.prototype.saveEntryFields = function() {
        return this.save(this.pick('id', 'sections_entry_fields'));
      };

      EntrySetSection.prototype.isCurrentSection = function() {
        return this.collection.isCurrentSection(this);
      };

      EntrySetSection.prototype.entryFieldIds = function() {
        if (this.get("sections_entry_fields")) {
          return this.get("sections_entry_fields").pluck('entry_field_id');
        } else {
          return this.get('entry_field_ids');
        }
      };

      return EntrySetSection;

    })(Entities.Model);
    Entities.EntrySetSections = (function(_super) {
      __extends(EntrySetSections, _super);

      function EntrySetSections() {
        return EntrySetSections.__super__.constructor.apply(this, arguments);
      }

      EntrySetSections.prototype.model = Entities.EntrySetSection;

      EntrySetSections.prototype.initialize = function(models, options) {
        this.entrySetId = options.entrySetId, this.entrySetResponse = options.entrySetResponse, this.currentSectionId = options.currentSectionId, this.sectionNo = options.sectionNo;
        this.url = function() {
          return Routes.entry_set_sections_path(this.entrySetId);
        };
        return this.on("change:current:section", function(options) {
          this.currentSectionId = options.model.id;
          return this.currentSection = options.model;
        });
      };

      EntrySetSections.prototype.entryFieldIds = function() {
        return _.flatten(_.map(this.models, function(i) {
          return i.entryFieldIds();
        }));
      };

      EntrySetSections.prototype.hasFieldWithId = function(id) {
        return _.contains(this.entryFieldIds(), id);
      };

      EntrySetSections.prototype.comparator = function() {
        return this.get('display_order');
      };

      EntrySetSections.prototype.newSection = function(args) {
        var attributes;
        attributes = {
          entry_sets_sections: [
            {
              entry_set_id: this.entrySetId,
              display_order: this.length + 1
            }
          ]
        };
        return new this.model(_.extend(attributes, args));
      };

      EntrySetSections.prototype.getCurrentSection = function() {
        if (this.currentSectionId) {
          return this.get(this.currentSectionId);
        } else {
          return this.first();
        }
      };

      EntrySetSections.prototype.isCurrentSection = function(section) {
        return section.id === this.getCurrentSection().id;
      };

      EntrySetSections.prototype.setCurrentToLast = function() {
        return this.sectionNo = this.last().get("display_order");
      };

      EntrySetSections.prototype.isCurrentLast = function() {
        return this.currentDisplayNo() === this.size();
      };

      EntrySetSections.prototype.isCurrentFirst = function() {
        return this.currentDisplayNo() === 1;
      };

      EntrySetSections.prototype.getNextSection = function() {
        return this.findWhere({
          display_order: this.currentDisplayNo() + 1
        });
      };

      EntrySetSections.prototype.getPreviousSection = function() {
        return this.findWhere({
          display_order: this.currentDisplayNo() - 1
        });
      };

      EntrySetSections.prototype.currentDisplayNo = function() {
        return this.getCurrentSection().get('display_order');
      };

      EntrySetSections.prototype.getLastDisplayNo = function() {
        return this.last().get("display_order");
      };

      EntrySetSections.prototype.addNewSection = function(args) {
        var section;
        section = this.newSection(args);
        this.add(section, {
          silent: true
        });
        this.setCurrentToLast();
        this.trigger("reset");
        return section;
      };

      return EntrySetSections;

    })(Entities.Collection);
    API = {
      getSectionEntities: function(options) {
        var sections;
        sections = new Entities.EntrySetSections([], options);
        sections.fetch({
          reset: true
        });
        return sections;
      }
    };
    return App.reqres.setHandler("entry:set:sections:entities", function(options) {
      return API.getSectionEntities(options);
    });
  });

}).call(this);