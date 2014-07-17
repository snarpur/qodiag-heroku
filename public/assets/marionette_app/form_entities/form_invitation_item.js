(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.FormInvitationItemModel = (function(_super) {
      __extends(FormInvitationItemModel, _super);

      function FormInvitationItemModel() {
        return FormInvitationItemModel.__super__.constructor.apply(this, arguments);
      }

      FormInvitationItemModel.prototype.urlRoot = Routes.invitation_items_path();

      FormInvitationItemModel.prototype.initialize = function() {
        this.validation = {};
        return FormInvitationItemModel.__super__.initialize.apply(this, arguments);
      };

      FormInvitationItemModel.prototype.relations = [
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

      return FormInvitationItemModel;

    })(Entities.ResponderItem);
    API = {
      getResponderItemForId: function(options) {
        var item;
        item = new Entities.FormInvitationItemModel;
        item.url = Routes.invitation_item_step_path(options.id, {
          step_no: options.step_no,
          type: options.type
        });
        item.fetch({
          reset: true
        });
        return item;
      }
    };
    return App.reqres.setHandler("get:responder:item", function(options) {
      return API.getResponderItemForId(options);
    });
  });

}).call(this);
