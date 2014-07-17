(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.FormPreRegistrationModel = (function(_super) {
      __extends(FormPreRegistrationModel, _super);

      function FormPreRegistrationModel() {
        return FormPreRegistrationModel.__super__.constructor.apply(this, arguments);
      }

      FormPreRegistrationModel.prototype.urlRoot = Routes.pre_registrations_path();

      FormPreRegistrationModel.prototype.initialize = function() {
        this.validation = {};
        return FormPreRegistrationModel.__super__.initialize.apply(this, arguments);
      };

      FormPreRegistrationModel.prototype.relations = [
        {
          type: Backbone.One,
          key: 'subject',
          relatedModel: function() {
            return App.Entities.FormPersonModel;
          }
        }, {
          type: Backbone.One,
          key: 'respondent',
          relatedModel: function() {
            return App.Entities.FormPersonModel;
          }
        }
      ];

      return FormPreRegistrationModel;

    })(Entities.ResponderItem);
    API = {
      getResponderItemForId: function(options) {
        var item;
        item = new Entities.FormPreRegistrationModel;
        item.url = Routes.pre_registration_step_path(options.id, {
          step_no: options.step_no
        });
        item.fetch({
          reset: true
        });
        return item;
      }
    };
    return App.reqres.setHandler("get:responder:item:pre:registration", function(options) {
      return API.getResponderItemForId(options);
    });
  });

}).call(this);
