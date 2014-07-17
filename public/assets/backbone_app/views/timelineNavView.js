(function() {
  var _base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (_base = App.Views).Timeline || (_base.Timeline = {});

  App.Views.Timeline.Nav = (function(_super) {
    __extends(Nav, _super);

    function Nav() {
      this.render = __bind(this.render, this);
      return Nav.__super__.constructor.apply(this, arguments);
    }

    Nav.prototype.tagName = "nav";

    Nav.prototype.events = {
      "click li:nth-child(1)": "forward",
      "click li:nth-child(2)": "backward"
    };

    Nav.prototype.forward = function() {
      return this.model.step(-6);
    };

    Nav.prototype.backward = function() {
      return this.model.step(6);
    };

    Nav.prototype.template = function() {
      return JST['backbone_app/templates/timelineNavTmpl'];
    };

    Nav.prototype.render = function() {
      $(this.el).html(this.template()(this.model.toJSON()));
      return this;
    };

    return Nav;

  })(Backbone.View);

}).call(this);
