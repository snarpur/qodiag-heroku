(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.EntrySetResponse = (function(_super) {
      __extends(EntrySetResponse, _super);

      function EntrySetResponse() {
        return EntrySetResponse.__super__.constructor.apply(this, arguments);
      }

      EntrySetResponse.prototype.nestedAttributeList = ['entry_values'];

      EntrySetResponse.prototype.blacklist = ['entry_set_name'];

      EntrySetResponse.prototype.paramRoot = "entry_set_response";

      EntrySetResponse.prototype.urlRoot = function() {
        return Routes.entry_set_responses_path();
      };

      EntrySetResponse.prototype.relations = [
        {
          type: Backbone.One,
          key: 'entry_set',
          relatedModel: function() {
            return App.Entities.EntrySet;
          }
        }, {
          type: Backbone.Many,
          key: 'entry_values',
          collectionType: "" + App.Qodiag.namespace + ".Entities.EntryValues",
          relatedModel: function() {
            return App.Entities.EntryValue;
          }
        }
      ];

      EntrySetResponse.prototype.initialize = function() {
        this.validation = {};
        return EntrySetResponse.__super__.initialize.apply(this, arguments);
      };

      EntrySetResponse.prototype.currentSection = function() {
        var sections;
        if (!(this.get('entry_set') == null)) {
          sections = this.get('entry_set').get('sections');
        }
        return sections != null ? sections.getCurrentSection() : void 0;
      };

      EntrySetResponse.prototype.getSectionResponses = function() {
        return this.currentSection().getSectionEntryResponses(this.id);
      };

      EntrySetResponse.prototype.getEntryValuesForSection = function() {
        return _.chain(this.get('entry_fields').models).map(function(i) {
          return i.get("entry_values").models;
        }).flatten().value();
      };

      return EntrySetResponse;

    })(Entities.Model);
    Entities.EntrySetResponses = (function(_super) {
      __extends(EntrySetResponses, _super);

      function EntrySetResponses() {
        return EntrySetResponses.__super__.constructor.apply(this, arguments);
      }

      EntrySetResponses.prototype.model = Entities.EntrySetResponse;

      EntrySetResponses.prototype.initialize = function(models, options) {
        this.url = function() {
          return Routes.entry_set_responses_path();
        };
        return EntrySetResponses.__super__.initialize.apply(this, arguments);
      };

      return EntrySetResponses;

    })(Entities.Collection);
    API = {
      getEntrySetResponse: function(options) {
        var responseSet;
        responseSet = new Entities.EntrySetResponse({
          id: options.id
        });
        responseSet.fetch({
          reset: true
        });
        return responseSet;
      }
    };
    return App.reqres.setHandler("entry:set:response:entities", function(options) {
      return API.getEntrySetResponse(options);
    });
  });

}).call(this);
