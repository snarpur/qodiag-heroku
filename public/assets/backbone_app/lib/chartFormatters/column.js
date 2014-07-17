(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Lib.ChartFormatters.Column = (function(_super) {
    __extends(Column, _super);

    function Column() {
      this.tooltipFormatter = __bind(this.tooltipFormatter, this);
      this.xAxisLabelsFormatter = __bind(this.xAxisLabelsFormatter, this);
      this.plotOptionsColumnDataLabelsFormatter = __bind(this.plotOptionsColumnDataLabelsFormatter, this);
      return Column.__super__.constructor.apply(this, arguments);
    }

    Column.prototype.plotOptionsColumnDataLabelsFormatter = function() {
      return function() {
        if ((this.point.config.name != null) && this.point.config.name.data_label) {
          return this.point.config.name.data_label;
        } else {
          return this.y;
        }
      };
    };

    Column.prototype.xAxisLabelsFormatter = function() {
      var accessCode, standardDeviation;
      accessCode = this.chart.accessCode;
      standardDeviation = this.chart.chart.type === 'areaspline';
      return function() {
        var str;
        if (standardDeviation) {
          return this.value;
        } else if (_.isNaN(parseInt(this.value))) {
          str = I18n.t("surveys." + accessCode + ".terms." + this.value);
        } else {
          str = I18n.t("surveys." + accessCode + ".terms.terms")[parseInt(this.value) - 1];
        }
        if (_.includes(str, 'missing')) {
          str = this.value;
        }
        str.replace(/\s/, "\n");
        return _.capitalize(str);
      };
    };

    Column.prototype.tooltipFormatter = function(options) {
      var formatters;
      formatters = {
        countHighScores: function() {
          var labelText, totalHighScores;
          labelText = "";
          if (typeof this.points === "object") {
            totalHighScores = _.countBy(_.toArray(_.pluck(this.points[0].point.values, 'weight')), function(num) {
              return _.contains(options.argument, num);
            })["true"];
            if (totalHighScores > 0) {
              labelText += '<strong>' + options.argument.join(I18n.t("terms.y")) + ': </strong>';
              labelText += totalHighScores + '/' + this.points[0].point.values.length;
            }
          }
          return labelText;
        },
        "default": function() {
          return "";
        }
      };
      return formatters[options.name];
    };

    return Column;

  })(App.Lib.ChartFormatters.Chart);

}).call(this);
