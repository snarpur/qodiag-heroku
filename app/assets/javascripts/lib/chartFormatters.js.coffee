class App.Lib.chartFormatters 
  

  formatters = [
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
    _.each(formatters, (f) ->
      formatterArray = f.split(".")
      configFormatterObj = _.reduce(_.initial(formatterArray), ((m, i) -> m[i]), that.chart)
      configFormatterKey = _.last(formatterArray)
      configFormatterObj[configFormatterKey] = that.getFormatterFunction(f)
    )
    
  getFormatterFunction:(str)=>
    formatter = _.camelize(_.last(str.split("."), 2).join(" "))
    @[formatter].call()


  dataLabelsFormatter:()=>
    ()->
      if @point.config.name? and @point.config.name.data_label
        @point.config.name.data_label
      else
        @.y

  labelsFormatter:=>
    accessCode = @view.timeline.getSurveyAccessCode(@view.model.get("survey_id"))
    ()->
      str = I18n.t("surveys.#{accessCode}.terms.#{@.value}")
      str = @.value if _.includes(str,'missing')
      _.capitalize(str)

  legendLabelFormatter: (v)=>
    accessCode = @view.timeline.getSurveyAccessCode(@view.model.get("survey_id"))
    () ->
      str = I18n.t("surveys.#{accessCode}.terms.#{@.name}")
      str = @.name if _.includes(str,'missing')
      _.capitalize(str)

  tooltipFormatter:()=>
    ()->
      str = ""
      _.each(@.points, (p) ->
        str += "<span style=text-align:center;color:#eaeaea;font-size:14px;font-weight:bold;text-decoration:underline;>#{p.series.tooltipOptions.heading}</span>"
        str += "<br/>"
        str +=  "  <span style=text-align:center;color:#fcf9ae;background-color: #999999;>#{p.series.tooltipOptions.content[p.x]}</span>"
        str += "<br/><br/>"
      )
      str

class App.Lib.columnFormatters extends App.Lib.chartFormatters





class App.Lib.lineFormatters extends App.Lib.chartFormatters


  formatters = [
    "plotOptions.column.dataLabels.formatter",
    "xAxis.labels.formatter",
    "legend.labelFormatter"
  ]

  legendLabelFormatter:=>
    accessCode = @view.timeline.getSurveyAccessCode(@view.model.id)
    () ->
      str = I18n.t("surveys.#{accessCode}.terms.#{@.name}")
      str = @.name if _.includes(str,'missing')
      _.capitalize(str)
  
  dataLabelsFormatter:=>
    () ->
      if @point.config.name? and @point.config.name.data_label
        @point.config.name.data_label
      else
        @.y

  labelsFormatter:()=>
    () ->
      I18n.l("date.formats.default",new Date(@.value))