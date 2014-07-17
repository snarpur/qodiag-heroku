(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(Backbone) {
    return _.extend(Backbone.Validation.validators, {
      minMultichoiceOptions: (function(_this) {
        return function(value, attr, customValue, model) {
          return model.get("field_type") === "multi-choice" && value.size() < customValue;
        };
      })(this)
    });
  })(Backbone);

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.EntryField = (function(_super) {
      __extends(EntryField, _super);

      function EntryField() {
        return EntryField.__super__.constructor.apply(this, arguments);
      }

      EntryField.prototype.urlRoot = Routes.entry_fields_path();

      EntryField.prototype.paramRoot = 'entry_field';

      EntryField.prototype.blacklist = ['index', 'editable', 'ok'];

      EntryField.prototype.relations = [
        {
          type: Backbone.Many,
          key: 'entry_values',
          collectionType: "" + App.Qodiag.namespace + ".Entities.EntryValues",
          relatedModel: function() {
            return App.Entities.EntryValue;
          }
        }, {
          type: Backbone.Many,
          key: 'entry_field_options',
          collectionType: "" + App.Qodiag.namespace + ".Entities.EntryFieldOptions",
          relatedModel: function() {
            return App.Entities.EntryFieldOption;
          }
        }
      ];

      EntryField.prototype.initialize = function() {
        this.url = function() {
          if (this.isNew()) {
            return this.urlRoot;
          } else {
            return "" + this.urlRoot + "/" + this.id;
          }
        };
        if (!_.isEmpty(this.get('entry_field_options'))) {
          this.listenTo(this.get('entry_field_options'), "options:add", this.addOption);
          this.listenTo(this.get('entry_field_options'), "options:remove", this.removeOption);
          this.listenTo(this, "option:selected", this.selectOption);
        }
        return EntryField.__super__.initialize.apply(this, arguments);
      };

      EntryField.prototype.removeOption = function(model, options) {
        return this.get('entry_values').removeEntryFieldOption(options);
      };

      EntryField.prototype.addOption = function(model, options) {
        return this.get('entry_values').addEntryFieldOption(options);
      };

      EntryField.prototype.selectOption = function(model, options) {
        return this.get('entry_values').selectEntryFieldOption(options);
      };

      return EntryField;

    })(Entities.Model);
    Entities.EntryFields = (function(_super) {
      __extends(EntryFields, _super);

      function EntryFields() {
        return EntryFields.__super__.constructor.apply(this, arguments);
      }

      EntryFields.prototype.model = Entities.EntryField;

      EntryFields.prototype.initialize = function(models, options) {
        this.sectionId = options.sectionId, this.entrySetId = options.entrySetId;
        this.url = function() {
          if (this.sectionId) {
            return Routes.section_entry_fields_path(this.sectionId);
          } else {
            return Routes.entry_fields_path();
          }
        };
        return EntryFields.__super__.initialize.apply(this, arguments);
      };

      EntryFields.prototype.comparator = function(entryField) {
        return _(entryField.get('title')).capitalize();
      };

      EntryFields.prototype.getSearchCollection = function() {
        return this.searchCollection;
      };

      EntryFields.prototype.getLiveCollection = function() {
        return this.liveCollection;
      };

      EntryFields.prototype.createSearchCollection = function(disabledIds) {
        if (disabledIds == null) {
          disabledIds = [];
        }
        if (!_.isEmpty(disabledIds)) {
          this.remove(this.filter(function(model) {
            return _.contains(disabledIds, model.id);
          }));
        }
        this.liveCollection = window.queryEngine.createLiveCollection(this.models);
        this.liveCollection.setComparator(function(entry) {
          return _(entry.get('title')).capitalize();
        });
        this.on("search:update", function(searchString) {
          return this.updateSearchCollection(searchString);
        });
        return this.searchCollection = this.liveCollection.createLiveChildCollection().setFilter('search', function(model, searchString) {
          var pass, searchRegex;
          if ((searchString == null) || (searchString != null ? searchString.length : void 0) < 3) {
            return true;
          }
          searchRegex = queryEngine.createSafeRegex(searchString);
          pass = searchRegex.test(model.get('title'));
          return pass;
        }).query();
      };

      EntryFields.prototype.updateSearchCollection = function(searchString) {
        return this.searchCollection.setSearchString(searchString).query();
      };

      return EntryFields;

    })(Entities.Collection);
    API = {
      getEntryFieldEntities: function(options) {
        var fields;
        fields = new Entities.EntryFields([], _.omit(options, 'callback'));
        fields.fetch({
          reset: true
        });
        return fields;
      }
    };
    return App.reqres.setHandler("entry:fields:entities", function(options) {
      if (options == null) {
        options = {};
      }
      return API.getEntryFieldEntities(options);
    });
  });

}).call(this);
