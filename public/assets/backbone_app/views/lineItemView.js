(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).Timeline || (_base.Timeline = {});

  App.Views.Timeline.LineItem = (function(_super) {
    __extends(LineItem, _super);

    function LineItem() {
      this.highlight = __bind(this.highlight, this);
      this.setPosition = __bind(this.setPosition, this);
      this.statusPosition = __bind(this.statusPosition, this);
      this.setStatus = __bind(this.setStatus, this);
      this.show = __bind(this.show, this);
      return LineItem.__super__.constructor.apply(this, arguments);
    }

    LineItem.prototype.tagName = "span";

    LineItem.prototype.className = "item";

    LineItem.prototype.events = {
      "click": "show"
    };

    LineItem.prototype.initialize = function() {
      this.line = this.options.line;
      this.timeline = this.options.timeline;
      this.model.view = this;
      this.setPosition();
      this.setStatus();
      return this.model.bind("change:dialogView", this.highlight);
    };

    LineItem.prototype.template = function() {
      return JST['backbone_app/templates/lineItemTmpl'];
    };

    LineItem.prototype.show = function() {
      if (this.model.status() === "completed") {
        return this.line.trigger("updateDialog", this.model);
      }
    };

    LineItem.prototype.setStatus = function() {
      return $(this.el).addClass(this.model.status());
    };

    LineItem.prototype.statusPosition = function() {
      if (this.model.status() === "completed") {
        return this.model.get("completed");
      } else {
        return this.model.get("deadline");
      }
    };

    LineItem.prototype.setPosition = function() {
      var pos;
      pos = this.timeline.positionOnLine(new Date(this.statusPosition()));
      return $(this.el).css('left', "" + pos + "px");
    };

    LineItem.prototype.highlight = function() {
      if (this.model.get("dialogView")) {
        return $(this.el).addClass('open-dialog');
      } else {
        return $(this.el).removeClass('open-dialog');
      }
    };

    LineItem.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };

    return LineItem;

  })(Backbone.View);

}).call(this);
