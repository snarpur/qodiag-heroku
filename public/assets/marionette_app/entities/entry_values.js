(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.EntryValue = (function(_super) {
      __extends(EntryValue, _super);

      function EntryValue() {
        return EntryValue.__super__.constructor.apply(this, arguments);
      }

      EntryValue.prototype.urlRoot = Routes.entry_values_path;

      EntryValue.prototype.paramRoot = 'entry_value';

      EntryValue.prototype.entrySetResponseId = function() {
        var _ref;
        return this.get('entry_set_response_id') || ((_ref = this.collection) != null ? _ref.entrySetResponseId : void 0);
      };

      return EntryValue;

    })(Entities.Model);
    Entities.EntryValues = (function(_super) {
      __extends(EntryValues, _super);

      function EntryValues() {
        return EntryValues.__super__.constructor.apply(this, arguments);
      }

      EntryValues.prototype.model = Entities.EntryValue;

      EntryValues.prototype.initialize = function(models, options) {
        if (options) {
          this.entrySetResponseId = options.entrySetResponseId, this.entryField = options.entryField, this.sectionId = options.sectionId, this.personId = options.personId;
          this.url = function() {
            return "" + (Routes.entry_values_path()) + "/" + this.entrySetResponseId + "/" + this.sectionId;
          };
        }
        return EntryValues.__super__.initialize.apply(this, arguments);
      };

      EntryValues.prototype.addEntryFieldOption = function(options) {
        var existing;
        existing = this.findWhere({
          entry_field_option_id: options.entry_field_option_id
        });
        if (existing) {
          return existing.unset('_destroy');
        } else {
          return this.add(options);
        }
      };

      EntryValues.prototype.selectEntryFieldOption = function(options) {
        var existing;
        existing = this.findWhere({
          entry_field_option_id: options.entry_field_option_id
        });
        if (this.size() === 0) {
          return this.add(options);
        }
      };

      EntryValues.prototype.removeEntryFieldOption = function(options) {
        var existing;
        existing = this.findWhere({
          entry_field_option_id: options.entry_field_option_id
        });
        if (existing && (existing.id != null)) {
          return existing.set('_destroy', true);
        } else {
          return this.remove(options);
        }
      };

      return EntryValues;

    })(Entities.Collection);
    API = {
      getEntryValues: function(options) {
        var values;
        values = new Entities.EntryValues([], options);
        values.fetch({
          reset: true
        });
        return values;
      }
    };
    return App.reqres.setHandler("entry:values:entities", function(options) {
      return API.getEntryValues(options);
    });
  });

}).call(this);
