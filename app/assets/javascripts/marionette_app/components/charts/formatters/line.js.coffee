@Qapp.module "Components.Charts", (Charts, App, Backbone, Marionette, $, _) ->

  Charts.Formatter ||= {}

  class Charts.Formatter.Line extends Charts.Formatter.Base 

    formatters:-> 
      [ 
        "plotOptions.column.dataLabels.formatter",
        "xAxis.labels.formatter",
        "legend.labelFormatter" 
      ]


    xAxisLabelsFormatter:()=>
      () ->
        I18n.l("date.formats.default",new Date(@.value))