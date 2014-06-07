@Qapp.module "Components.Charts", (Charts, App, Backbone, Marionette, $, _) ->

  class Charts.Drilldown extends Backbone.Model
  
    initialize:->
      @chart = @.get('chart')
      @.set("paramsHistory",[@chart.attributes])
      @chart.get('plotOptions').column.cursor = 'pointer'
      @chart.get('plotOptions').column.point.events.click = @drilldown


    
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


    getQuestionList:(questionGroupName)=>
      console.log   "getQuestionList:(questionGroupName)=>"

      # questionList = new App.Collections.QuestionResponse(questionGroupName, @chart)
      # drilldown = @
      # callbacks= 
      #   success: (model,response)->
      #    drilldown.addQuestionListToHistory(questionList)
      #   error: (model,response)->
      #     throw I18n.t("surveys.messages.question_list_failed", name: questionGroupName)
      
      # questionList.fetch(callbacks)
    

    mergeParamsFromRoot:(params)=>
      inherited = ["chart","credits","legend","subtitle","title","tooltip","yAxis","xAxis","plotOptions"]
      _.each(inherited,((i)->
          target = params[i]
          target ?= {}
          params[i] = $.extend({},@chart.get(i),target)
      ),@)
      params.chart.width = App.Timeline.Dimensions.history_view_width
      params

    
    isQuestionList:(category)->
      _.contains(@chart.get('questionListDrilldown'),category)

    
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


