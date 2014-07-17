(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("Components.Charts", function(Charts, App, Backbone, Marionette, $, _) {
    return Charts.DrilldownView = (function(_super) {
      __extends(DrilldownView, _super);

      function DrilldownView() {
        this.initialize = __bind(this.initialize, this);
        return DrilldownView.__super__.constructor.apply(this, arguments);
      }

      DrilldownView.prototype.className = "reset-drilldown-icn";

      DrilldownView.prototype.tagName = "span";

      DrilldownView.prototype.events = {
        "click": "drillup"
      };

      DrilldownView.prototype.initialize = function(chart) {
        this.chart = this.options.chart;
        this.model = new Charts.Drilldown({
          chart: this.chart
        });
        return this.model.on("change:paramsHistory", this.setDrilldown);
      };

      return DrilldownView;

    })(App.Views.ItemView);
  });

}).call(this);
