(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.AddRemoveButton = (function(_super) {
    __extends(AddRemoveButton, _super);

    function AddRemoveButton() {
      this.addRemove = __bind(this.addRemove, this);
      return AddRemoveButton.__super__.constructor.apply(this, arguments);
    }

    AddRemoveButton.prototype.initialize = function() {
      return this.form = this.options.form;
    };

    AddRemoveButton.prototype.events = {
      'click button.add-remove-btn': 'addRemove'
    };

    AddRemoveButton.prototype.template = function() {
      return JST['backbone_app/templates/siblingsControllsTmpl'];
    };

    AddRemoveButton.prototype.addRemove = function() {};

    AddRemoveButton.prototype.render = function() {
      if ((this.template() != null)) {
        return this.form.$el.append($(this.el).html(this.template()({})));
      }
    };

    return AddRemoveButton;

  })(Backbone.View);

}).call(this);