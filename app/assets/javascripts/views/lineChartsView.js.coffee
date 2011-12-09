App.Views.LineCharts ||= {}

class App.Views.LineCharts extends Backbone.View

  className: "line-chart"

  initialize:->
    @timeline = @.options.timeline
  
  template:->
    JST['templates/lineChartsTmpl']

  charts: (item) =>
    @model.get('charts')[item]

  setWidth:(chart)=>
    width = (@timeline.get('canvas_width') * 0.8) + 22
    _.extend(chart.chart, {width: width}) 
  
  dataLabelFormatter:=>
    () ->
      if @point.config.name? and @point.config.name.data_label
        @point.config.name.data_label
      else
        @.y

  legendFormatter:=>
    accessCode = @timeline.getSurveyAccessCode(@model.id)
    () ->
      str = I18n.t("surveys.#{accessCode}.terms.#{@.name}")
      str = @.name if _.includes(str,'missing')
      _.capitalize(str)

  setCategories:(chart)=>
    categories = _.map(chart.xAxis.categories, (c)-> I18n.l("date.formats.default",new Date(c)))
    _.extend(chart.xAxis, {categories: categories})
  
  setHeight:(chart)=>
    _.extend(chart.chart, {height: @timeline.getChartHeight()})  

  setLegendFormatter:(chart)=>
    _.extend(chart.legend, {labelFormatter: @legendFormatter()})

  highChart:(chart)=>
    @setCategories(chart)
    @setLegendFormatter(chart)
    @setHeight(chart)
    @setWidth(chart)
    chart

  renderChart:(chart)=>
    chartEl = $(@template()(chart))
    $(@el).append(chartEl)
    high = new Highcharts.Chart(@highChart(chart))

  
  renderCharts:=>
    _.each(@model.get('charts'), @renderChart)
  
  render:->
  	@ 

