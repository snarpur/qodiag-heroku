@Qapp.module "Components.Chart", (Chart, App, Backbone, Marionette, $, _) ->

  Chart.Formatter ||= {}

  class Chart.Formatter.Line extends Chart.Formatter.Base 

    formatters:-> 
      [ 
        "plotOptions.column.dataLabels.formatter",
        "xAxis.labels.formatter",
        "legend.labelFormatter" 
      ]


    xAxisLabelsFormatter:()=>
      () ->
        I18n.l("date.formats.default",new Date(@.value))