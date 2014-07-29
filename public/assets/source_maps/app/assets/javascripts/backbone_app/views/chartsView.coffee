App.Views.Charts ||= {}

class App.Views.Charts extends Backbone.View
  
  className: "column-chart"


  initialize:->
    @timeline = @.options.timeline
    @item = @.options.item
    @item.on("change:dialogView",@unBindEvents)


  
  template:->
    JST['backbone_app/templates/chartsTmpl']

  unBindEvents:=>
    unless @item.get("dialogView")?
      App.Event.off()
      @item.off()

  charts: (item) =>
    @item.get('charts')[item]

  #REFACTOR: Equal width columns in adjescent charts calculate fixed column width and set plotOptions.pointWidth 
  chartWidth:(chart)=>
    total_size = 0
    _.each(@item.get('charts'),(n)->total_size += n.size)
    width =  @timeline.get('canvas_width') * (chart.size/total_size)
    (width * 0.8) + 22

  chartHeight:->
    App.Timeline.Dimensions.line_height_expanded * 0.8

  setChartDiv:(chart)=>
    chart.chart.renderTo = @.$el.find("\##{chart.chart.renderTo} > div")[0]
    chart
  

  renderChart:(chart)=>
    chartEl = $(@template()(chart))
    $(@el).append(chartEl)
    formatter = new App.Lib.ChartFormatters.column(chart)
    chart = formatter.setFormatters()
    chart = @setChartDiv(chart)
    chart.chart.width = @chartWidth(chart)
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
