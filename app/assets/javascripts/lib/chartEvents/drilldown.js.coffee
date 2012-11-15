App.Lib.ChartEvents ||= {}

class App.Lib.ChartEvents.Drilldown extends Backbone.Model
  
  initialize:->
    @chart = @.get('chart')
    @view =  @.get('view')
    @.on("change:drilldown",@drillup)
  
  setChartObject:(chart)->
    @chartObject = chart

  drillup:=>
    unless @.get("drilldown")
      params =
        categories: @chart.xAxis.categories
        series: @chart.series

      @drawChart(params)

  drilldown:(event)->
    handler = @series.chart.options.drilldownHandler
    handler.setChartObject(@series.chart)
    if @drilldown
      handler.set("drilldown",handler.chart)
      handler.drawChart(@drilldown)

  drawChart:(params)->
    formatter = new App.Lib.chartFormatters.column(_.extend(params,{accessCode: @chart.accessCode}))
    params = formatter.setFormatters()
    inherited = ["chart","credits","legend","subtitle","title","tooltip","yAxis"]
    _.each(inherited,((i)->
      target = params[i]
      target ?= {}
      params[i] = $.extend({},@chart[i],target)
    ),@)

    @chartObject.destroy()
    new Highcharts.Chart(params)

  setDrilldownEvent:()=>
    _.each(@chart.series,((v,k)->
      if v?.point?.events
        pointEvent = _.first(_.keys(v.point.events))
        pointFunction = _.first(_.values(v.point.events))
        v.point.events[pointEvent] = @[pointFunction]
        @chart.drilldownHandler =  @
        # SET EVENTS ON DRILLDOWN SERIES  
        # v.data = _.map(v.data,(i)-> 
        #   _.each(i.drilldown.series,(s)-> s = _.extend(s,{point: v.point}))
        #   i
        # )
      ),@)
    @chart