@Qapp.module "TimelineApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base

    initialize:(id,options)->
      @subjectId = id
      @showSubjectNavigation(id)
      @getItems()
    
    getItems:()->
      items = App.request "get:person:responder:items",{personId:@subjectId,concern:'subject'}
      visItems = new vis.DataSet()
      App.execute "when:fetched", items, =>
        items.each (model)->
          if model.get("survey_id")? 

            start = new Date(model.get("completed") ? model.get("deadline"))
            start = moment(start).minutes(0).seconds(0).milliseconds(0)

            params = {id: "#{model.get('id')}",type: 'point'}
            params.start = start 
            params.content = model.get("survey").access_code
            visItems.add params
          
       
        @showContent({items: items, visItems: visItems})
    
    showSubjectNavigation:(subjectId)->
      @person = App.request "get:person:entity", subjectId

      App.execute "when:fetched", @person, =>
        App.execute "show:subject:navigation",{person: @person, personId: subjectId, currentItemName: 'timeline'}
    

    showContent:(options)->
      
      @listenTo @getLayout(), "show", ()=>
        @showTimeline(options)

      @listenTo @getLayout(), "add:survey:clicked", ()=> 
        @createSurvey()
      
      App.contentRegion.show @getLayout()

    getTimeline:(model)->
      @timelineView ?= new List.Timeline(model: model)


    getLayout:->
      @layout ?= new List.Layout()
    

    showTimeline:(options)->
      visModel = new Backbone.Model(options)
      
      @show @getTimeline(visModel),
        region: @getLayout().timelineRegion 

      @listenTo @getTimeline(), "item:selected", (options)=>
        @getColumnCharts(options)
        
    
    createSurvey:(options = {})->
      view = App.request "create:survey:view", options

    chartsLayout:(options={})->
      new List.ChartLayout(options)



    chartsView:(options)->
      new List.ColumnCharts(options)
    
    
    
    onChangeChart:(layout)->
      @listenTo layout, "active:chart:selected", (view)=>
        @charts.setCurrentMetric(view.model.get("name"))
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
        chartsLayout.chartsRegion.show chartView

        