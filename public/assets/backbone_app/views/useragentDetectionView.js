(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.useragentDetectionView = (function(_super) {
    __extends(useragentDetectionView, _super);

    function useragentDetectionView() {
      return useragentDetectionView.__super__.constructor.apply(this, arguments);
    }

    useragentDetectionView.prototype.className = "useragent-detection";

    useragentDetectionView.prototype.initialize = function() {
      return this.browser = this.options.browser;
    };

    useragentDetectionView.prototype.template = function() {
      return JST['backbone_app/templates/useragentDetectionTmpl'];
    };

    useragentDetectionView.prototype.render = function() {
      $(this.el).html(this.template()(this.browser));
      return this;
    };

    return useragentDetectionView;

  })(Backbone.View);

}).call(this);
