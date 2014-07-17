(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    Entities.FormPersonModel = (function(_super) {
      __extends(FormPersonModel, _super);

      function FormPersonModel() {
        return FormPersonModel.__super__.constructor.apply(this, arguments);
      }

      FormPersonModel.prototype.initialize = function() {
        this.validation = {};
        this.on("change:full_cpr", function(model, value, options) {
          var data;
          if (value.length === 10) {
            data = App.request("get:national_register:data", value);
            return App.execute("when:fetched", data, (function(_this) {
              return function() {
                if (!data.isEmpty()) {
                  return _this.mergeNationalRegisterData(data);
                }
              };
            })(this));
          }
        });
        return FormPersonModel.__super__.initialize.apply(this, arguments);
      };

      FormPersonModel.prototype.mergeNationalRegisterData = function(data) {
        if (this.get("address") != null) {
          this.get("address").set(data.get("address"));
        }
        return this.set(data.attributes);
      };

      FormPersonModel.prototype.relations = [
        {
          type: Backbone.One,
          key: 'address',
          relatedModel: function() {
            return App.Entities.FormAddressModel;
          }
        }, {
          type: Backbone.One,
          key: 'user',
          relatedModel: function() {
            return App.Entities.FormUserModel;
          }
        }, {
          type: Backbone.Many,
          key: 'inverse_relationships',
          collectionType: "Qapp.Entities.Relationships",
          relatedModel: function() {
            return App.Entities.Relationship;
          }
        }
      ];

      return FormPersonModel;

    })(Entities.Person);
    return Entities.FormPeopleCollection = (function(_super) {
      __extends(FormPeopleCollection, _super);

      function FormPeopleCollection() {
        return FormPeopleCollection.__super__.constructor.apply(this, arguments);
      }

      FormPeopleCollection.prototype.model = Entities.FormPersonModel;

      return FormPeopleCollection;

    })(Entities.Collection);
  });

}).call(this);
