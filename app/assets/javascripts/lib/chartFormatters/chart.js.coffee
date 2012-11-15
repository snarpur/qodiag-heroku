App.Lib.chartFormatters ||= {}
class App.Lib.chartFormatters.chart 
   
  formatters: ->
    [ 
      "plotOptions.column.dataLabels.formatter",
      "xAxis.labels.formatter",
      "legend.labelFormatter",
      "tooltip.formatter",
      "subtitle.text",
      "title.text"
    ]

  constructor:(chart_config)->
    @chart = chart_config

  setFormatters:() =>
    that = @
    _.each(@formatters(), (f) ->
      formatterArray = f.split(".")
      configFormatterObj = _.reduce(_.initial(formatterArray), ((m, i) -> 
        m[i] if m?[i]?
      ), that.chart)
      configFormatterKey = _.last(formatterArray)
      if configFormatterObj?[configFormatterKey]?
        configFormatterObj[configFormatterKey] = that.getFormatterFunction(f)
    )
    @chart
    
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

  subtitleText:=>
    I18n.l("date.formats.long",@chart.subtitle.text)

  titleText:=>
    title = _.chain(@chart.title.text)
      .map(((i)->@["title#{_(i[0]).capitalize()}"].call(@,i[1])),@)
      .flatten()
      .value()
    title.join(" ")

  titleSurvey:(name)->
    _(I18n.t("surveys.#{name}.name")).capitalize()
  
  titleSex:(sex)->
    I18n.t("surveys.terms.#{sex}")
  
  titleAge:(age)->
    str = "#{age} "
    str.concat(I18n.t("surveys.terms.age"))
  
  titleRespondent:(respondent)->
    I18n.t("surveys.terms.norm_reference.#{respondent}")

