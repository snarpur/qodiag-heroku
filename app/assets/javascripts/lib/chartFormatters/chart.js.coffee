App.Lib.chartFormatters ||= {}
class App.Lib.chartFormatters.chart 
  

  formatters: ->
    [ 
      "plotOptions.column.dataLabels.formatter",
      "xAxis.labels.formatter",
      "legend.labelFormatter",
      "tooltip.formatter"
    ]
  
  constructor:(chart_config,view)->
    @chart = chart_config
    @view = view

  
  setFormatters:() =>
    that = @
    _.each(@formatters(), (f) ->
      formatterArray = f.split(".")
      configFormatterObj = _.reduce(_.initial(formatterArray), ((m, i) -> m[i]), that.chart)
      configFormatterKey = _.last(formatterArray)
      configFormatterObj[configFormatterKey] = that.getFormatterFunction(f)
    )
    
  getFormatterFunction:(str)=>
    formatter = _.camelize(_.last(str.split("."), 2).join(" "))
    @[formatter].call()

  dataLabelsFormatter:=>
    () ->
      if @point.config.name? and @point.config.name.data_label
        @point.config.name.data_label
      else
        @.y

  legendLabelFormatter:=>
    accessCode = @chart.accessCode
    () ->
      str = I18n.t("surveys.#{accessCode}.terms.#{@.name}")
      str = @.name if _.includes(str,'missing')
      _.capitalize(str)

