App.Lib.ChartEvents ||= {}

class App.Lib.ChartEvents.Drilldown extends Backbone.Model
  
  initialize:->
    @chart = @.get('chart')
    @.set("paramsHistory",[@chart])
    @chart.plotOptions.column.cursor = 'pointer'
    @chart.plotOptions.column.point.events.click = @drilldown
    @.on("drillup",@drillup)

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
      @addChartToHistory(drilldown)
    else if @isQuestionList(target.category)
      @getQuestionList(target.category)
      
  # setFormatters:(params)=>
  #   formatter = new App.Lib.chartFormatters.questionList(_.extend(params,{accessCode: @chart.accessCode}))
  #   params = $.extend(true,{},formatter.setFormatters())


  getQuestionList:(questionGroupName)=>
    questionList = new App.Collections.QuestionResponse(questionGroupName, @get('responderItem'))
    drilldown = @
    callbacks= 
      success: (model,response)->
       drilldown.addQuestionListToHistory(questionList)
      error: (model,response)->
        throw "questions for #{questionGroupName} list failed "
    
    questionList.fetch(callbacks)
  mergeParamsFromRoot:(params)=>
    inherited = ["chart","credits","legend","subtitle","title","tooltip","yAxis","xAxis","plotOptions"]
    _.each(inherited,((i)->
      target = params[i]
      target ?= {}
      params[i] = $.extend({},@chart[i],target)
    ),@)
    params

  isQuestionList:(category)->
    _.contains(@chart.questionListDrilldown,category)

  addQuestionListToHistory:(questionResponse)=>
    paramsHistory = @.get("paramsHistory")
    paramsHistory.push(questionResponse)
    @.set('paramsHistory',paramsHistory)
    @.trigger('change:paramsHistory')

  addChartToHistory:(params)=>
    params = @mergeParamsFromRoot(params)
    paramsHistory = @.get("paramsHistory")
    paramsHistory.push(params)
    @.set('paramsHistory',paramsHistory)
    @.trigger('change:paramsHistory')


