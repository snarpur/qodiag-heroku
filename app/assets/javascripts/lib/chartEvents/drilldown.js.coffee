App.Lib.ChartEvents ||= {}

class App.Lib.ChartEvents.Drilldown extends Backbone.Model
  
  initialize:->
    @chart = @.get('chart')
    @.on("drillup",@drillup)
    @setDrilldownEvent()

  drillup:=>
    @.get('drilldown').destroy()  

  drilldown:(event)->
    handler = @series.chart.options.drilldownHandler
    handler.set({rootChart:@series.chart})
    handler.drawChart(@drilldown) if @drilldown
      
  drawChart:(params)->
    params = @setFormatters(params)
    params = @mergeParamsFromRoot(params)
    @destroyRootChart()
    @createDrilldownChart(params)

  setFormatters:(params)=>
    formatter = new App.Lib.chartFormatters.column(_.extend(params,{accessCode: @chart.accessCode}))
    params = $.extend(true,{},formatter.setFormatters())

  mergeParamsFromRoot:(params)=>
    inherited = ["chart","credits","legend","subtitle","title","tooltip","yAxis"]
    _.each(inherited,((i)->
      target = params[i]
      target ?= {}
      params[i] = $.extend({},@chart[i],target)
    ),@)
    params

  destroyRootChart:=>
    @.get('rootChart').destroy()

  createDrilldownChart:(params)=>
    @.set('drilldown',new Highcharts.Chart(params))

  setDrilldownEvent:()=>
    _.each(@chart.series,((v,k)->
      if v?.point?.events
        pointEvent = _.first(_.keys(v.point.events))
        pointFunction = _.first(_.values(v.point.events))
        v.point.events[pointEvent] = @[pointFunction]
        @chart.drilldownHandler =  @
      ),@)
    @chart