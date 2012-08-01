class App.Lib.chartFormatters.line extends App.Lib.chartFormatters.chart


  formatters:-> 
    [ 
      "plotOptions.column.dataLabels.formatter",
      "xAxis.labels.formatter",
      "legend.labelFormatter" 
    ]


  labelsFormatter:()=>
    () ->
      I18n.l("date.formats.default",new Date(@.value))