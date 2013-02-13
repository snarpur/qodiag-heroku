App.Lib.ChartEvents ||= {}

class App.Lib.ChartEvents.Drilldown extends Backbone.Model
  
  initialize:->
    @chart = @.get('chart')
    @.set("paramsHistory",[@chart])
    @chart.plotOptions.column.cursor = 'pointer'
    @chart.plotOptions.column.point.events.click = @drilldown
    @.on("drillup",@drillup)
    # @.on("change:previousChart",@destroyPreviousChart)

  drillup:=>
    paramsHistory = _.initial(@.get('paramsHistory'))
    @.set("paramsHistory",paramsHistory)

  getCurrentChartParams:->
    _.last(@get("paramsHistory"))

  drilldown:(event)=>
    target = event.currentTarget
    if target.drilldown
      @.set({previousChart:target.series.chart})
      drilldown = $.extend(true,{},target.drilldown)
      @addParamsToHistory(drilldown) 


  setFormatters:(params)=>
    console.warn params
    formatter = new App.Lib.chartFormatters.questionList(_.extend(params,{accessCode: @chart.accessCode}))
    params = $.extend(true,{},formatter.setFormatters())

  mergeParamsFromRoot:(params)=>
    inherited = ["chart","credits","legend","subtitle","title","tooltip","yAxis","plotOptions"]
    _.each(inherited,((i)->
      target = params[i]
      target ?= {}
      params[i] = $.extend({},@chart[i],target)
    ),@)
    params

  addParamsToHistory:(params)=>
    params = @setFormatters(params)
    params = @mergeParamsFromRoot(params)
    paramsHistory = @.get("paramsHistory")
    paramsHistory.push(params)
    @.set('paramsHistory',paramsHistory)
    @.trigger('change:paramsHistory')

  # destroyPreviousChart:=>
  #   console.log "DESTROYING :: ",@.get('previousChart').xAxis[0].categories 
  #   @.get('previousChart').destroy()

  
  # createDrilldownChart:(params)=>
  #   @.set('drilldownChart',new Highcharts.Chart(params))

