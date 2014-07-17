(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Lib.ChartFormatters.QuestionList = (function(_super) {
    __extends(QuestionList, _super);

    function QuestionList() {
      this.legendLabelFormatter = __bind(this.legendLabelFormatter, this);
      this.yAxisLabelsFormatter = __bind(this.yAxisLabelsFormatter, this);
      this.xAxisLabelsFormatter = __bind(this.xAxisLabelsFormatter, this);
      return QuestionList.__super__.constructor.apply(this, arguments);
    }

    QuestionList.prototype.xAxisLabelsFormatter = function() {
      var accessCode;
      accessCode = this.chart.accessCode;
      return function() {
        var css, height, str;
        if (_.isNaN(parseInt(this.value))) {
          str = I18n.t("surveys." + accessCode + ".terms." + this.value);
        } else {
          str = I18n.t("surveys." + accessCode + ".questions")[parseInt(this.value) - 1];
        }
        if (_.includes(str, 'missing')) {
          str = this.value;
        }
        str.replace(/\s/, "\n");
        height = this.chart.plotBox.height / this.axis.categories.length;
        css = "'height:" + height + "px; line-height:" + height + "px;'";
        return "<span style=" + css + ">" + (_.capitalize(str)) + "</span>";
      };
    };

    QuestionList.prototype.yAxisLabelsFormatter = function() {
      var accessCode;
      accessCode = this.chart.accessCode;
      return function() {
        var css, str, width;
        str = I18n.t("surveys." + accessCode + ".answers")[parseInt(this.value)];
        width = this.chart.plotBox.width / this.axis.max;
        css = "'widt:" + width + "px; margin-left:" + width + "px;'";
        return "<span style=" + css + ">" + (_.capitalize(str)) + "</span>";
      };
    };

    QuestionList.prototype.legendLabelFormatter = function() {
      var accessCode;
      accessCode = this.chart.accessCode;
      return function() {
        var str;
        str = I18n.t("surveys." + accessCode + ".terms." + this.name);
        if (_.includes(str, 'missing')) {
          str = this.name;
        }
        return _.capitalize(str);
      };
    };

    return QuestionList;

  })(App.Lib.ChartFormatters.Column);

}).call(this);
