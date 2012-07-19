#TODO:: clean up formatters

App.Views.Charts ||= {}

class App.Views.Charts extends Backbone.View
  
  className: "column-chart"

  initialize:->
    @timeline = @.options.timeline
  
  template:->
    JST['templates/chartsTmpl']

  charts: (item) =>
    @model.get('charts')[item]

  chartWidth:(chart)=>
    total_size = 0
    _.each(@model.get('charts'), (n)->
      total_size += n.size
    )
    width =  @timeline.get('canvas_width') * (chart.size/total_size)
    (width * 0.8) + 22


  renderChart:(chart)=>
    chartEl = $(@template()(chart))
    formatter = new App.Lib.columnFormatters(chart,@)
    formatter.setFormatters()
    chartEl.width(@chartWidth(chart))
    $(@el).append(chartEl)
    high = new Highcharts.Chart(chart)

  
  renderCharts:=>
    _.each(@model.get('charts'), @renderChart)
  
  render:->
    @