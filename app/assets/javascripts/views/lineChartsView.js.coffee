App.Views.LineCharts ||= {}

class App.Views.LineCharts extends Backbone.View

  className: "line-chart"

  initialize:->
    @timeline = @.options.timeline
  
  template:->
    JST['templates/lineChartsTmpl']

  # charts: (item) =>
  #   @model.get('charts')[item]

  chartWidth:(chart)=>
    width = (@timeline.get('canvas_width') * 0.8) + 22
  

  renderChart:(chart)=>
    chartEl = $(@template()(chart))
    $(@el).append(chartEl)
    formatter = new App.Lib.lineFormatters(chart,@)
    formatter.setFormatters()
    chartEl.width(@chartWidth(chart))
    high = new Highcharts.Chart(chart)

  
  renderCharts:=>
    _.each(@model.get('charts'), @renderChart)
  
  render:->
  	@ 

