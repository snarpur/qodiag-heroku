sn.declare("Chart.Bar", _o.extend(sn.Chart.Chart ,{
    init:function(elem){
        this.obj = $(elem).data("obj");
        this.data = elem;
        var max = this._getMax();
        var opt = {};
        opt.legend = {
            show:this._showLegend(),
            placement: 'outsideGrid'
        };
        opt.title = this.data.legend;
        opt.seriesDefaults = {
            renderer: $.jqplot.BarRenderer,
            pointLabels: { show: true, edgeTolerance: 5}
           // rendererOptions:{barPadding: 8, barMargin: 60}
        };
        opt.series = this.data.chart.data_labels;
        opt.axesDefaults= { max: max + 1 };
        opt.axes = {
            xaxis:{
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: this.data.chart.bar_labels
            },
            yaxis:{
                min: 0,
                ticks: this.data.chart.increment
            }
        };
        console.info(opt)

        $.jqplot("bar-chart", _.values(this.data.chart.data), opt);
       }

}));