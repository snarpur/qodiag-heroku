(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    Entities.EntryFieldOption = (function(_super) {
      __extends(EntryFieldOption, _super);

      function EntryFieldOption() {
        return EntryFieldOption.__super__.constructor.apply(this, arguments);
      }

      EntryFieldOption.prototype.urlRoot = "entry_field_options";

      EntryFieldOption.prototype.paramRoot = 'entry_field_option';

      return EntryFieldOption;

    })(Entities.Model);
    return Entities.EntryFieldOptions = (function(_super) {
      __extends(EntryFieldOptions, _super);

      function EntryFieldOptions() {
        return EntryFieldOptions.__super__.constructor.apply(this, arguments);
      }

      EntryFieldOptions.prototype.model = Entities.EntryFieldOption;

      return EntryFieldOptions;

    })(Entities.Collection);
  });

}).call(this);
