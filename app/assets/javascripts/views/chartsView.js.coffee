App.Views.Charts ||= {}

class App.Views.Charts extends Backbone.View
  
  className: "column-chart"


  initialize:->
    @timeline = @.options.timeline
    @item = @.options.item
    @model = new Backbone.Model()
  
  template:->
    JST['templates/chartsTmpl']

  charts: (item) =>
    @item.get('charts')[item]

  #REFACTOR: Equal width columns in adjescent charts calculate fixed column width and set plotOptions.pointWidth 
  chartWidth:(chart)=>
    total_size = 0
    _.each(@item.get('charts'), (n)->
      total_size += n.size
    )
    width =  @timeline.get('canvas_width') * (chart.size/total_size)
    (width * 0.8) + 22

  renderChart:(chart)=>
    chartEl = $(@template()(chart))
    formatter = new App.Lib.chartFormatters.column(chart)
    chart = formatter.setFormatters()
    
    drilldownReset = new App.Views.DrilldownReset({chart:chart}).render()
    $(@el).append(chartEl)
    chartEl.width(@chartWidth(chart))
    highChart = new Highcharts.Chart(chart)
    #START: prepend reset on drilldown
    chartEl.prepend(drilldownReset.el)

  renderCharts:=>
    _.each(@item.get('charts'), @renderChart)
  
  render:->
    @