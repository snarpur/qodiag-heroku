(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("ResponderItemsApp.Create", function(Create, App, Backbone, Marionette, $, _) {
    return Create.ResponderItem = (function(_super) {
      __extends(ResponderItem, _super);

      function ResponderItem() {
        this.templateHelpers = __bind(this.templateHelpers, this);
        return ResponderItem.__super__.constructor.apply(this, arguments);
      }

      ResponderItem.prototype.template = "responder_items/create/templates/responder_item";

      ResponderItem.prototype.templateHelpers = function() {
        return {
          respondents: (function(_this) {
            return function() {
              return _this.options.respondents;
            };
          })(this),
          entrySets: (function(_this) {
            return function() {
              return _this.options.entrySets;
            };
          })(this)
        };
      };

      ResponderItem.prototype.ui = {
        heading: 'label[for="deadline_date"]',
        datepickerWrapper: "div[data-date-wrapper='true']"
      };

      ResponderItem.prototype.onRender = function() {
        var _this;
        _this = this;
        return this.ui.datepickerWrapper.datepicker({
          dateFormat: "dd/mm/yy",
          minDate: new Date().addDays(1),
          onSelect: function(date, obj) {
            return _this.model.set('deadline', date);
          }
        });
      };

      ResponderItem.prototype.modelEvents = {
        "change:deadline": function() {
          this.ui.heading.html(I18n.t("views.responder_items.requests.for", {
            date: this.formatDeadline()
          }));
          return this.ui.heading.effect('highlight', 2000);
        }
      };

      ResponderItem.prototype.formatDeadline = function() {
        return moment(this.model.get('deadline'), "DD/MM/YYYY").fromNow();
      };

      ResponderItem.prototype.events = {
        "change select": "triggerSelect"
      };

      ResponderItem.prototype.triggerSelect = function(event) {
        var ident, nestedKey, value;
        ident = $(event.target).attr('id');
        value = $(event.target).val();
        nestedKey = $(event.target).attr('data-nested-key');
        value = nestedKey && !!value ? _.object([nestedKey], [value]) : value;
        return this.model.set(ident, value);
      };

      return ResponderItem;

    })(App.Views.ItemView);
  });

}).call(this);
