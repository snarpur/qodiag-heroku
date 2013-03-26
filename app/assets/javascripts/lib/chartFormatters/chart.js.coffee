App.Lib.ChartFormatters ||= {}
class App.Lib.ChartFormatters.Chart 
    
  formatters: ->
    [ 
      "plotOptions.column.dataLabels.formatter",
      "plotOptions.scatter.dataLabels.formatter",
      "xAxis.labels.formatter",
      "yAxis.labels.formatter",
      "legend.labelFormatter",
      "tooltip.formatter",
      "subtitle.text",
      "title.text"
    ]
 
  constructor:(chart_config)->
    @chart = chart_config
 
  findValue:(obj,path)->
    pathArray = path.split(".")
    nestedValue = _.reduce(pathArray, ((m, i) -> 
      m[i] if m?[i]?
    ),obj)
    nestedValue

  findKey:(obj,path)->
    pathArray = path.split(".")
    nestedKey = _.reduce(_.initial(pathArray), ((m, i) -> 
      m[i] if m?[i]?
    ),obj)
    nestedKey
  
  findKeyAndValue:(obj,path)=>
    pathArray = path.split(".")
    nestedValue = _.last(pathArray)
    nestedKey = _.reduce(_.initial(pathArray), ((m, i) -> 
      m[i] if m?[i]?
    ),obj)
    if nestedKey?
      {key: nestedKey, value: nestedValue}

  setFormatters:() =>
    _.each(@formatters(),((f) ->
      target = @findKeyAndValue(@chart,f)
      if target?.key?[target.value]?
        target.key[target.value] = @getFormatterFunction(f)
    ),@)
    @chart
     
  getFormatterFunction:(str)=>
    functionString = _.camelize(str.replace(/\./g,"-"))
    @[functionString].call()

  plotOptionsColumnDataLabelsFormatter:->
    () ->
      if @point.config.name? and @point.config.name.data_label
        @point.config.name.data_label
      else
        @.y


  plotOptionsScatterDataLabelsFormatter:=>
    accessCode = @chart.accessCode
    () ->
      nameI18n = _.capitalize(I18n.t("surveys.#{accessCode}.terms.#{@series.name.name}"))
      "#{@series.name.value} #{nameI18n}"
      


  legendLabelFormatter: =>
    accessCode = @chart.accessCode
    () ->
      str = I18n.t("surveys.#{accessCode}.terms.#{@.name}")
      str = @.name if _.includes(str,'missing')
      _.capitalize(str)
  
  
  subtitleText: =>
    I18n.l("date.formats.long",@chart.subtitle.text)
  
  titleText: =>
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