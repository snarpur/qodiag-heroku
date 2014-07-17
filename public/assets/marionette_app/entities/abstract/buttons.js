(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    var API;
    Entities.Button = (function(_super) {
      __extends(Button, _super);

      function Button() {
        return Button.__super__.constructor.apply(this, arguments);
      }

      Button.prototype.defaults = {
        buttonType: "button"
      };

      return Button;

    })(Backbone.Model);
    Entities.ButtonsCollection = (function(_super) {
      __extends(ButtonsCollection, _super);

      function ButtonsCollection() {
        return ButtonsCollection.__super__.constructor.apply(this, arguments);
      }

      ButtonsCollection.prototype.model = Entities.Button;

      ButtonsCollection.prototype.comparator = function(button) {
        return button.get('order');
      };

      return ButtonsCollection;

    })(Backbone.Collection);
    API = {
      getFormButtons: function(buttons, model) {
        var buttonCollection;
        buttons = this.getDefaultButtons(buttons, model);
        buttonCollection = new Entities.ButtonsCollection(buttons);
        buttonCollection.placement = buttons.placement;
        return buttonCollection;
      },
      getDefaultButtons: function(buttons, model) {
        var defaultButtons;
        defaultButtons = {
          buttons: {
            primary: {
              text: I18n.t("actions.save"),
              className: "btn btn-success",
              order: 1,
              buttonType: 'submit'
            },
            cancel: {
              text: I18n.t("actions.cancel"),
              className: "btn btn-default",
              order: 2,
              buttonType: "cancel",
              dataDismiss: "data-dismiss='modal'"
            }
          },
          config: {
            placement: "right"
          }
        };
        return _.chain(_.union(_.keys(buttons), _.keys(defaultButtons.buttons))).map(function(i) {
          var _base;
          if (buttons[i] !== false) {
            if ((_base = defaultButtons.buttons)[i] == null) {
              _base[i] = {};
            }
            return _.extend(defaultButtons.buttons[i], buttons[i]);
          }
        }).compact().value();
      }
    };
    return App.reqres.setHandler("form:button:entities", function(buttons, model) {
      if (buttons == null) {
        buttons = {};
      }
      return API.getFormButtons(buttons, model);
    });
  });

}).call(this);
