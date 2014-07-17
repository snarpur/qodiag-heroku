(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.EntrySet = (function(_super) {
      __extends(EntrySet, _super);

      function EntrySet() {
        return EntrySet.__super__.constructor.apply(this, arguments);
      }

      EntrySet.prototype.urlRoot = Routes.entry_sets_path();

      EntrySet.prototype.paramRoot = 'entry_set';

      EntrySet.prototype.relations = [
        {
          type: Backbone.Many,
          key: 'sections',
          collectionType: "" + App.Qodiag.namespace + ".Entities.Sections",
          relatedModel: function() {
            return App.Entities.Section;
          }
        }
      ];

      EntrySet.prototype.initialize = function() {
        this.validation = {};
        return EntrySet.__super__.initialize.apply(this, arguments);
      };

      return EntrySet;

    })(Entities.Model);
    Entities.EntrySetsCollection = (function(_super) {
      __extends(EntrySetsCollection, _super);

      function EntrySetsCollection() {
        return EntrySetsCollection.__super__.constructor.apply(this, arguments);
      }

      EntrySetsCollection.prototype.model = Entities.EntrySet;

      EntrySetsCollection.prototype.initialize = function() {
        this.url = function() {
          return Routes.entry_sets_path();
        };
        return EntrySetsCollection.__super__.initialize.apply(this, arguments);
      };

      return EntrySetsCollection;

    })(Entities.Collection);
    API = {
      getEntrySets: function(callBack) {
        var entrySets;
        entrySets = new Entities.EntrySetsCollection([]);
        entrySets.fetch({
          reset: true
        });
        return entrySets;
      },
      getEntrySet: function(options) {
        var entrySet;
        entrySet = new Entities.EntrySet({
          id: options.id
        });
        entrySet.fetch();
        return entrySet;
      },
      createEntrySet: function(options) {
        var entrySet;
        entrySet = new Entities.EntrySet({
          name: 'Untitled'
        });
        entrySet.save(entrySet.attributes);
        return entrySet;
      },
      newEntrySet: function(options) {
        return new Entities.EntrySet(options);
      }
    };
    App.reqres.setHandler("entry:sets:entities", function(options) {
      if (options == null) {
        options = {};
      }
      return API.getEntrySets(options);
    });
    App.reqres.setHandler("entry:set:entity", function(options) {
      if (options == null) {
        options = {};
      }
      return API.getEntrySet(options);
    });
    App.reqres.setHandler("create:entry:set:entity", function(options) {
      if (options == null) {
        options = {};
      }
      return API.createEntrySet(options);
    });
    return App.reqres.setHandler("new:entry:set:entity", function(options) {
      if (options == null) {
        options = {};
      }
      return API.newEntrySet(options);
    });
  });

}).call(this);
