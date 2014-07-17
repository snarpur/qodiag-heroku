(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).Timeline || (_base.Timeline = {});

  App.Views.Timeline.NewItem = (function(_super) {
    __extends(NewItem, _super);

    function NewItem() {
      this.renderCalendar = __bind(this.renderCalendar, this);
      this.getSelectedRespondent = __bind(this.getSelectedRespondent, this);
      this.saveCallbacks = __bind(this.saveCallbacks, this);
      this.saveItem = __bind(this.saveItem, this);
      this.setIdle = __bind(this.setIdle, this);
      this.close = __bind(this.close, this);
      return NewItem.__super__.constructor.apply(this, arguments);
    }

    NewItem.prototype.className = "line-overlay new-item state-idle";

    NewItem.prototype.events = {
      "click .btn-submit": "saveItem",
      "click .btn-cancel": "close",
      "click span.close": "close"
    };

    NewItem.prototype.selectedDate = null;

    NewItem.prototype.initialize = function() {
      this.timeline = this.options.timeline;
      this.createAndListenToNewItem();
      return this.model.bind("change:newItemOverlayState", this.setIdle);
    };

    NewItem.prototype.template = function() {
      return JST['backbone_app/templates/newItemTmpl'];
    };

    NewItem.prototype.close = function() {
      return this.model.set({
        newItemOverlayState: "closed"
      });
    };

    NewItem.prototype.setIdle = function() {
      if (this.model.get("newItemOverlayState") === "closed") {
        return $(this.el).setCssState("idle");
      }
    };

    NewItem.prototype.createAndListenToNewItem = function() {
      this.newItem = new App.Models.ResponderItem();
      this.listenTo(this.newItem, "change:deadline", this.renderSelectedAlert);
      return this.listenTo(this.newItem, "change:deadline", this.setLineState);
    };

    NewItem.prototype.saveItem = function() {
      var params;
      this.$el.setCssState("sending");
      App.Lib.Spinner.spin(this.$(".state-msg .m-sending")[0]);
      params = {
        subject_id: this.timeline.getSubjectId(),
        survey_id: this.model.get('survey_id'),
        respondent_id: this.getSelectedRespondent()
      };
      this.newItem.set(params);
      return this.newItem.save(this.newItem.attributes, this.saveCallbacks());
    };

    NewItem.prototype.saveCallbacks = function() {
      var callbacks, view;
      view = this;
      return callbacks = {
        success: function(model, response) {
          view.model.addItems(model);
          view.createAndListenToNewItem();
          App.Lib.Spinner.stop();
          return view.$el.setCssState("success");
        },
        error: function(model, xhr) {
          return $(view.el).setCssState("error");
        }
      };
    };

    NewItem.prototype.getSelectedRespondent = function() {
      return _.first(this.timeline.get("subject").get("respondents")).id;
    };

    NewItem.prototype.renderSelectedAlert = function(item, date) {
      if (_.isString(date)) {
        return;
      }
      return this.$(".state-msg .m-selected").html(JST['backbone_app/templates/newItemMsgTmpl']({
        date: item.get('deadline')
      }));
    };

    NewItem.prototype.setLineState = function() {
      return this.$el.setCssState("selected");
    };

    NewItem.prototype.setDeadline = function() {
      var view;
      view = this;
      return function(txt, d) {
        return view.newItem.set('deadline', $.datepicker.parseDate("dd/mm/yy", txt));
      };
    };

    NewItem.prototype.renderCalendar = function() {
      var options;
      options = {
        onSelect: this.setDeadline(),
        minDate: Date.today()
      };
      return this.$('.calendar').datepicker(options);
    };

    NewItem.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      this.renderCalendar();
      return this;
    };

    return NewItem;

  })(Backbone.View);

}).call(this);
