(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    return Entities.FormResponderItemModel = (function(_super) {
      __extends(FormResponderItemModel, _super);

      function FormResponderItemModel() {
        return FormResponderItemModel.__super__.constructor.apply(this, arguments);
      }

      FormResponderItemModel.prototype.initialize = function() {
        this.validation = {};
        return FormResponderItemModel.__super__.initialize.apply(this, arguments);
      };

      FormResponderItemModel.prototype.relations = [
        {
          type: Backbone.One,
          key: 'entry_set_response',
          relatedModel: function() {
            return App.Entities.EntrySetResponse;
          }
        }, {
          type: Backbone.One,
          key: 'survey',
          relatedModel: function() {
            return App.Entities.Survey;
          }
        }, {
          type: Backbone.One,
          key: 'respondent',
          relatedModel: function() {
            return App.Entities.Person;
          }
        }
      ];

      return FormResponderItemModel;

    })(Entities.ResponderItem);
  });

}).call(this);
