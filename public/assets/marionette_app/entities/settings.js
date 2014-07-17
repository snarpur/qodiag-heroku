(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.Setting = (function(_super) {
      __extends(Setting, _super);

      function Setting() {
        return Setting.__super__.constructor.apply(this, arguments);
      }

      return Setting;

    })(Entities.Model);
    Entities.SettingsCollection = (function(_super) {
      __extends(SettingsCollection, _super);

      function SettingsCollection() {
        return SettingsCollection.__super__.constructor.apply(this, arguments);
      }

      SettingsCollection.prototype.model = Entities.Setting;

      SettingsCollection.prototype.rootSetting = 'entry_sets';

      SettingsCollection.prototype.initialize = function(models, options) {
        return this.currentSetting = options.currentSetting, this.subView = options.subView, options;
      };

      SettingsCollection.prototype.getCurrentSetting = function() {
        var setting, _ref;
        setting = this.findWhere({
          name: (_ref = this.currentSetting) != null ? _ref : this.rootSetting
        });
        if (this.subView) {
          setting.set('subView', this.subView);
        }
        return setting;
      };

      return SettingsCollection;

    })(Entities.Collection);
    API = {
      setCurrentSetting: function(currentSetting) {
        return new Entities.Setting(currentSetting);
      },
      getSettingsEntities: function(options) {
        var settings;
        settings = new Entities.SettingsCollection([
          {
            name: 'entry_sets',
            text: I18n.t("entry_set.model_name_plural")
          }, {
            name: 'entry_fields',
            text: I18n.t("terms.question")
          }
        ], options);
        return settings;
      }
    };
    return App.reqres.setHandler("get:settings", function(options) {
      return API.getSettingsEntities(options);
    });
  });

}).call(this);
