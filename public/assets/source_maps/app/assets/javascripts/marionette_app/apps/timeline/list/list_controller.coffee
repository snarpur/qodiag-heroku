@Qapp.module "TimelineApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base

    initialize:(id,options)->
      @subjectId = id
      @showSubjectNavigation(id)
      @getItems()


    getItems:()->
      @items = App.request "get:person:responder:items",{personId:@subjectId,concern:'subject'}
      
      @visItems = new vis.DataSet()
      @initialSurveys = []
      App.execute "when:fetched", @items, =>
        @items.each (model)=>
          if model.get("survey_id")? 
            @visItems.add @buildItem(model) 
            @initialSurveys.push model.get("survey_id")

        @showContent({items: @items, visItems: @visItems})

        @listenTo @items, "add",(model,collection)->
          @visItems.add @buildItem(model)


    buildItem:(responderItem)->
      start = new Date(responderItem.get("completed") ? responderItem.get("deadline"))
      start = moment(start).minutes(0).seconds(0).milliseconds(0)

      params = {id: "#{responderItem.get('id')}",surveyId: responderItem.get('survey_id'),type: 'point',className: @getItemClassName(responderItem)}
      params.start = start 
      params.content = if responderItem.get("survey")? then responderItem.get("survey").access_code else @surveys.get(responderItem.get('survey_id')).get("access_code")

      params
  
    getItemClassName:(model)->
      if @isCompleted(model) then "completed"
      else if @isPending(model) then "pending"
      else if @isOverdue(model) then "overdue"

    deadlineIsPassed:(model)->
      deadline = Date.parse(model.get('deadline'))
      deadline.isBefore(Date.today())

    isCompleted:(model)->
      model.get('completed')?
  
    isOverdue:(model)->
      !@isPending(model) and !@isCompleted(model)
  
    isPending:(model)->
      !@isCompleted(model) and !@deadlineIsPassed(model)

    
    showSubjectNavigation:(subjectId)->
      @person = App.request "get:person:entity", subjectId

      App.execute "when:fetched", @person, =>
        App.execute "show:subject:navigation",{person: @person, personId: subjectId, currentItemName: 'timeline'}
    

    showContent:(options)->
      
      @listenTo @getLayout(), "show", ()=>
        @showTimeline(options)
        @showMenu()

      @listenTo @getLayout(), "add:survey:clicked", ()=> 
        @createSurvey({itemCollection: @items})

      
      App.contentRegion.show @getLayout()

    showMenu:=>
      @surveys = App.request "get:surveys"
      App.execute "when:fetched", @surveys, =>
        @menuView ?= new List.Select({model: new Backbone.Model(), items: @items, collection: @surveys, initialSurveys: _.uniq @initialSurveys})
        @show @menuView,
          region: @getLayout().menuRegion

        @listenTo @menuView, "select:menu:changed", (options)=>
          if options.removed?
            @hideSurvey(options.removed.id)
          else
            @showSurvey(options.added.id)
        

    showSurvey:(surveyId)->
      @items.each (model)=>
        if model.get("survey_id") is surveyId
          @visItems.add @buildItem(model)
        

    hideSurvey:(surveyId)->
      itemIds = @visItems.get
        fields: ["id"]
        filter:(item)=>
          item.surveyId == surveyId

      @visItems.remove _.pluck itemIds, "id"

    getTimeline:(model)->
      @timelineView ?= new List.Timeline(model: model)


    getLayout:->
      @layout ?= new List.Layout()
    

    showTimeline:(options)->
      visModel = new Backbone.Model(options)

      @show @getTimeline(visModel),
        region: @getLayout().timelineRegion 

      @listenTo @getTimeline(), "item:selected", (options)=>
        @getColumnCharts(options) if options.item.get("completed")?  
    
    createSurvey:(options = {})->
      App.request "create:survey:view", options
    
    chartsLayout:(options={})->
      new App.Components.Charts.ChartLayout(options)

    chartsView:(options)->
      new App.Components.Charts.ColumnCharts(options)
    
    
    
    onChangeChart:(layout)->
      @listenTo layout, "active:chart:selected", (view)=>
        @charts.setCurrentMetric(view.model.get("name"))
        @updateChart()

    onChangeFilter:(layout)->
      @listenTo layout, "filter:changed", (view, normReference)=>
        @charts.setNormReferenceId(normReference.id)
        @updateChart()


    updateChart:->
      @charts.fetch
        reset: true


    getColumnCharts:(options)->
      chartsLayout = @chartsLayout()
      App.dialogRegion.show chartsLayout
      
      @charts = App.request "column:charts", options
      
      App.execute "when:fetched", @charts, =>
        chartView = @chartsView({ collection: @charts})
        @onChangeChart(chartsLayout)
        @onChangeFilter(chartsLayout)
        chartsLayout.chartsRegion.show chartView

        
