(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.SectionsEntryFields = (function(_super) {
      __extends(SectionsEntryFields, _super);

      function SectionsEntryFields() {
        this.updateDisplayOrder = __bind(this.updateDisplayOrder, this);
        return SectionsEntryFields.__super__.constructor.apply(this, arguments);
      }

      SectionsEntryFields.prototype.blacklist = ['index'];

      SectionsEntryFields.prototype.initialize = function() {
        this.url = function() {
          return Routes.section_sections_entry_fields_path(this.id);
        };
        return SectionsEntryFields.__super__.initialize.apply(this, arguments);
      };

      SectionsEntryFields.prototype.updateDisplayOrder = function(displayOrder) {
        var squeeze;
        displayOrder += 1;
        squeeze = (displayOrder - this.get('display_order')) > 0 ? 0.5 : -0.5;
        return this.set("display_order", displayOrder + squeeze);
      };

      SectionsEntryFields.prototype.destroy = function() {
        this.url = "section_entry_fields/" + this.id;
        return SectionsEntryFields.__super__.destroy.apply(this, arguments);
      };

      return SectionsEntryFields;

    })(Entities.Model);
    Entities.SectionsEntryFieldsCollection = (function(_super) {
      __extends(SectionsEntryFieldsCollection, _super);

      function SectionsEntryFieldsCollection() {
        return SectionsEntryFieldsCollection.__super__.constructor.apply(this, arguments);
      }

      SectionsEntryFieldsCollection.prototype.model = Entities.SectionsEntryFields;

      SectionsEntryFieldsCollection.prototype.initialize = function(models, options) {
        this.section = options.section;
        this.on("add remove", (function(_this) {
          return function(model, collection, opt) {
            var action;
            action = opt.add ? 'add' : 'remove';
            return _this.section.trigger("" + action + ":fields", {
              model: model
            });
          };
        })(this));
        this.url = function() {
          if (this.section) {
            return Routes.section_sections_entry_fields_path(this.section.id);
          }
        };
        return SectionsEntryFieldsCollection.__super__.initialize.apply(this, arguments);
      };

      SectionsEntryFieldsCollection.prototype.comparator = function(entry) {
        return entry.get('display_order');
      };

      SectionsEntryFieldsCollection.prototype.setDisplayOrder = function() {
        this.sort();
        this.each(function(item, index) {
          return item.set("display_order", index + 1);
        });
        return this.trigger("reset");
      };

      SectionsEntryFieldsCollection.prototype.removeField = function(model) {
        var _this;
        _this = this;
        if (model.id) {
          return model.destroy({
            success: function() {
              return _this.setDisplayOrder();
            },
            error: function() {
              throw I18n.t("marionette.errors.error_in_function", {
                "function": " - entities/sections_entry_fields.js.coffee:removeFromSection()"
              });
            }
          });
        } else {
          this.remove(model);
          return this.setDisplayOrder();
        }
      };

      return SectionsEntryFieldsCollection;

    })(Entities.Collection);
    return API = {
      getEntryFieldEntities: function(options) {
        var callback, fields;
        fields = new Entities.EntryFields([], _.omit(options, 'callback'));
        callback = options.callback;
        return fields.fetch({
          reset: true,
          success: function() {
            return callback(fields);
          }
        });
      }
    };
  });

}).call(this);
