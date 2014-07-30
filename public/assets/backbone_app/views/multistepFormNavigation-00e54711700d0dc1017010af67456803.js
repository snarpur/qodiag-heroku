(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.MultistepFormNavigation = (function(_super) {
    __extends(MultistepFormNavigation, _super);

    function MultistepFormNavigation() {
      this.render = __bind(this.render, this);
      this.attributes = __bind(this.attributes, this);
      return MultistepFormNavigation.__super__.constructor.apply(this, arguments);
    }

    MultistepFormNavigation.prototype.tagName = 'ul';

    MultistepFormNavigation.prototype.className = 'wizard-nav';

    MultistepFormNavigation.prototype.template = function() {
      return JST['backbone_app/templates/multistepFormNavigationTmpl'];
    };

    MultistepFormNavigation.prototype.attributes = function() {
      return this.setClass();
    };

    MultistepFormNavigation.prototype.setClass = function(step_no) {
      if (step_no === this.model.currentStepNo()) {
        return "current-step";
      }
    };

    MultistepFormNavigation.prototype.render = function() {
      var opt;
      opt = {};
      _.each(this.model.get('formMetaData').get('stepNames'), (function(item, index) {
        opt.stepNo = index + 1;
        opt.stepName = this.model.i18nStepName(item);
        opt.cssClass = this.setClass(index + 1);
        opt.formModelId = this.model.formModelId();
        return $(this.el).append(this.template()(opt));
      }), this);
      return this;
    };

    return MultistepFormNavigation;

  })(Backbone.View);

}).call(this);