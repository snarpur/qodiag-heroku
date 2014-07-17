(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.ResponderItem = (function(_super) {
      __extends(ResponderItem, _super);

      function ResponderItem() {
        return ResponderItem.__super__.constructor.apply(this, arguments);
      }

      ResponderItem.prototype.nestedAttributeList = ['entry_set_response'];

      ResponderItem.prototype.urlRoot = Routes.responder_items_path();

      ResponderItem.prototype.paramRoot = 'responder_item';

      ResponderItem.prototype.relations = [
        {
          type: Backbone.One,
          key: 'entry_set_response',
          relatedModel: function() {
            return App.Entities.EntrySetResponse;
          }
        }, {
          type: Backbone.One,
          key: 'subject',
          relatedModel: function() {
            return App.Entities.Person;
          }
        }, {
          type: Backbone.One,
          key: 'respondent',
          relatedModel: function() {
            return App.Entities.Person;
          }
        }
      ];

      return ResponderItem;

    })(Entities.Model);
    Entities.ResponderItems = (function(_super) {
      __extends(ResponderItems, _super);

      function ResponderItems() {
        return ResponderItems.__super__.constructor.apply(this, arguments);
      }

      ResponderItems.prototype.model = Entities.ResponderItem;

      ResponderItems.prototype.initialize = function(models, options) {
        this.personId = options.personId;
        this.concern = options.concern;
        this.url = function() {
          if (this.concern) {
            return Routes.person_responder_items_path(this.personId) + "?concern=" + this.concern;
          } else {
            return Routes.person_responder_items_path(this.personId);
          }
        };
        return ResponderItems.__super__.initialize.apply(this, arguments);
      };

      return ResponderItems;

    })(Entities.Collection);
    API = {
      getResponderItemsForPerson: function(options) {
        var items;
        items = new Entities.ResponderItems([], options);
        items.fetch({
          reset: true
        });
        return items;
      },
      getEntrySetResponderItemsForPerson: function(options) {
        var item;
        item = new Entities.ResponderItems([], options);
        item.url = Routes.person_entry_set_items_path(options.personId);
        item.fetch({
          reset: true
        });
        return item;
      }
    };
    App.reqres.setHandler("get:person:responder:items", function(options) {
      return API.getResponderItemsForPerson(options);
    });
    return App.reqres.setHandler("get:person:entry:set:responder:items", function(options) {
      return API.getEntrySetResponderItemsForPerson(options);
    });
  });

}).call(this);
