(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views.Timeline).LineHeading || (_base.LineHeading = {});

  App.Views.Timeline.LineHeading = (function(_super) {
    __extends(LineHeading, _super);

    function LineHeading() {
      this.removeHeader = __bind(this.removeHeader, this);
      this.newItem = __bind(this.newItem, this);
      return LineHeading.__super__.constructor.apply(this, arguments);
    }

    LineHeading.prototype.tagName = "li";

    LineHeading.prototype.events = {
      "click span.new-item": "newItem"
    };

    LineHeading.prototype.initialize = function() {
      this.model.headingView = this;
      return this.model.bind("remove", this.removeHeader);
    };

    LineHeading.prototype.newItem = function() {
      return this.model.set({
        newItemOverlayState: 'open'
      });
    };

    LineHeading.prototype.removeHeader = function(line) {
      return $(this.el).remove();
    };

    LineHeading.prototype.template = function() {
      return JST['backbone_app/templates/headingsTmpl'];
    };

    LineHeading.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };

    return LineHeading;

  })(Backbone.View);

}).call(this);
