@Qapp.module "Components.Charts", (Charts, App, Backbone, Marionette, $, _) ->



  class Charts.Column extends Backbone.Model
    urlRoot: "/responder_items/responses"
    chartOptionKeys: ["chart","series","accessCode","credits","legend","subtitle","drilldown","title","tooltip","yAxis","xAxis","plotOptions"]
    
    initialize:->
      @set "chartOptions", @pick(@chartOptionKeys)
      @initHistory()
      @url = ()->
        base = "#{@.urlRoot}/#{@get('id')}/column"
      super

    initHistory:->
      history =
        xAxis: 
          categories: _.clone(@get("chartOptions").xAxis.categories)
        series: _.clone(@get("chartOptions").series) 
      @set("drilldownHistory",[history],{silent: true})
    

    chartWidth:->
      (@get('size') / @collection.totalSize())
    

    back:(options={})=>
      unless @isChartRoot()
        @get('drilldownHistory').pop()
        last = _.last @get('drilldownHistory')
        base = @get("chartOptions")
        base.xAxis.categories = last.xAxis.categories
        base.series = last.series
        @trigger("change:drilldownHistory",{config: base,type:'drillup'})
      
  
      
  

    currentDrilldownLevel:->
      @get("drilldownHistory").length

    isChartRoot:->
      (@get("drilldownHistory").length == 1)


    addChartToHistory:(params)=>
      @get("drilldownHistory").push(params)
      base = @get("chartOptions")
      base.xAxis.categories = params.xAxis.categories
      base.series = params.series
      

      @trigger('change:drilldownHistory',{config:base,type:"drilldown"})

   


  class Charts.Columns extends Backbone.Collection
    model: Charts.Column
    
    

    initialize:(models,options)->
      @options = options
      @setCurrentMetric(options.currentMetric)

      @url = ->
        url = "/responder_items/responses/:id/column"
        url = url.replace(/\:id/,@responderItemId())
        if not _.isEmpty(@currentMetric)
          if not _.isEmpty(@normReferenceId)
            url = "#{url}/norm_reference/#{@normReferenceId}/#{@currentMetric}"
          else
            url = "#{url}/#{@currentMetric}"
        else
          if not _.isEmpty(@normReferenceId)
            url = "#{url}/norm_reference/#{@normReferenceId}"
        url

    parse:(response)->
      _.extend(@options, _.omit(response, "charts"))
      response.charts
      


    totalSize:->
      _.reduce(@pluck("size"),((memo, num)-> memo + num), 0)



    getChartMenu:->
      if @chartMenu 
        @chartMenu 
      else 
        @chartMenu = new Backbone.Collection @options.chartMetrics 

    getChartFilter:->
      if @chartFilters 
        @chartFilters 
      else
        @chartFilters = new Backbone.Collection @options.chartFilters
      

    responderItemId:->
      @options.responderItem.get("id")

    
    responderItem:->
      @options.responderItem

    

    setCurrentMetric:(name)->
      @currentMetric = name

    setNormReferenceId:(id)->
      @normReferenceId = id


  # class Entities.QuestionResponse extends Backbone.Model

  #   initialize:->
  #     @.set('surveyAccessCode', @collection.surveyAccessCode())


  # class Entities.QuestionResponse extends Backbone.Collection
  
  #   model: App.Models.QuestionResponse
  #   urlRoot: "/responder_items/responses/:id/question_group/:question_group_name"
  
  #   initialize:(questionGroupName,chart) ->
  #     @questionGroupName = questionGroupName
  #     @responderItem = chart.responderItem()

  #     @url = ()->
  #       url = @.urlRoot.replace(/\:id/,@responderItem.get('id'))
  #       url = url.replace(/\:question_group_name/, @questionGroupName)
  
  #   surveyAccessCode:=>
  #     @responderItem.get('access_code')



  API = 
    getCharts:(options) =>
      charts = new Charts.Columns([],{responderItem: options.item})
      charts.fetch
        reset: true
      charts
  
  
  App.reqres.setHandler "column:charts", (options) ->
    API.getCharts(options)

