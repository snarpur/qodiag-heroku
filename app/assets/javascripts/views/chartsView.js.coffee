App.Views.Charts ||= {}

class App.Views.Charts extends Backbone.View
  
  className: "column-chart"


  initialize:->
    @timeline = @.options.timeline
    @item = @.options.item
    @item.on("change:dialogView",@unBindEvents)
    App.Event.on("drilldown",@drilldown)

  
  template:->
    JST['templates/chartsTmpl']

  unBindEvents:=>
    unless @item.get("dialogView")?
      App.Event.off()
      @item.off()

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

  setChartDiv:(chart)=>
    chart.chart.renderTo = @.$el.find("\##{chart.chart.renderTo} > div")[0]
    chart
  
  drilldown:(status)=>
    @.$el.setCssState(status,"drilldown")


  renderChart:(chart)=>
    chartEl = $(@template()(chart))
    $(@el).append(chartEl)
    chartEl.width(@chartWidth(chart))
    formatter = new App.Lib.chartFormatters.column(chart)
    chart = formatter.setFormatters()
    chart = @setChartDiv(chart)
    drilldownParams=
      chart:chart, 
      chartEl:chartEl, 
      chartView: @,
      responderItem: @item
    drilldown = new App.Views.Drilldown(drilldownParams)
    new Highcharts.Chart(chart)
  
  renderCharts:=>
    _.each(@item.get('charts'), @renderChart)
  
  render:->
    @