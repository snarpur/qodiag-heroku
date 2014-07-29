class App.Lib.ChartFormatters.Line extends App.Lib.ChartFormatters.Chart


  formatters:-> 
    [ 
      "plotOptions.column.dataLabels.formatter",
      "xAxis.labels.formatter",
      "legend.labelFormatter" 
    ]


  xAxisLabelsFormatter:()=>
    () ->
      I18n.l("date.formats.default",new Date(@.value))
