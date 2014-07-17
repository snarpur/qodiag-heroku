(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    Entities.Section = (function(_super) {
      __extends(Section, _super);

      function Section() {
        return Section.__super__.constructor.apply(this, arguments);
      }

      Section.prototype.initialize = function() {
        this.url = function() {
          if (this.isNew()) {
            return Routes.sections_path();
          } else {
            return Routes.section_path(this.get('id'));
          }
        };
        return Section.__super__.initialize.apply(this, arguments);
      };

      Section.prototype.isCurrentSection = function() {
        return this.collection.isCurrentSection(this);
      };

      Section.prototype.getSectionEntryResponses = function(entrySetResponseId) {
        var entries;
        entries = new App.Entities.EntryFields([], {});
        entries.url = Routes.entry_set_response_section_path(entrySetResponseId, this.id);
        entries.fetch({
          reset: true
        });
        return entries;
      };

      return Section;

    })(Entities.Model);
    Entities.Sections = (function(_super) {
      __extends(Sections, _super);

      function Sections() {
        return Sections.__super__.constructor.apply(this, arguments);
      }

      Sections.prototype.model = Entities.Section;

      Sections.prototype.url = function() {
        return Routes.sections_path();
      };

      Sections.prototype.initialize = function(models, options) {
        Sections.__super__.initialize.apply(this, arguments);
        return this.on("change:current:section", function(options) {
          this.currentSectionId = options.model.id;
          return this.currentSection = options.model;
        });
      };

      Sections.prototype.isCurrentSection = function(section) {
        return section.id === this.getCurrentSection().id;
      };

      Sections.prototype.getCurrentSection = function() {
        if (this.currentSectionId) {
          return this.get(this.currentSectionId);
        } else {
          return this.first();
        }
      };

      Sections.prototype.setCurrentToLast = function() {
        return this.sectionNo = this.last().get("display_order");
      };

      Sections.prototype.isCurrentLast = function() {
        return this.currentDisplayNo() === this.size();
      };

      Sections.prototype.isCurrentFirst = function() {
        return this.currentDisplayNo() === 1;
      };

      Sections.prototype.currentDisplayNo = function() {
        return this.getCurrentSection().get('display_order');
      };

      Sections.prototype.getNextSection = function() {
        return this.findWhere({
          display_order: this.currentDisplayNo() + 1
        });
      };

      Sections.prototype.getPreviousSection = function() {
        return this.findWhere({
          display_order: this.currentDisplayNo() - 1
        });
      };

      return Sections;

    })(Entities.Collection);
    return App.reqres.setHandler("entities:section", function(options) {
      return API.getSection(options);
    });
  });

}).call(this);
