@Qapp.module "TimelineApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "timeline/list/templates/list_layout"
    regions:
      timelineRegion: "#timeline-region"
      menuRegion: "#menu-region"

    triggers:
      "click .add-survey"  : "add:survey:clicked"

  



  class List.Select extends App.Views.ItemView
    template: "timeline/list/templates/menu"

    ui:->
      select: "#menu"

    events:
      "change #menu" : "triggerSelect"

    triggerSelect:(event)->
      @trigger("select:menu:changed",event)

    onShow:->
      @ui.select.val(_.extend(@options.initialSurveys,{placeholder: "TRANSLATE ME"}))
      @ui.select.select2
        multiple: true
        initSelection:(element, callback)=>
          data = []

          _.each element.val().split(","), (item)=>
            query = {id: Number(item)}
            survey = @collection.findWhere query
            data.push({id: Number(item), text: survey.get('text')})

          callback(data);


        query:(query)=>
          data = {
            results: @collection.toJSON()
          }
          query.callback data

      @listenTo @options.items, "add", (model,collection)=>
        surveysSelected = @ui.select.select2('val')
        if _.indexOf(surveysSelected, model.get("survey_id")) is -1
          surveysSelected.push model.get("survey_id")
          @ui.select.select2('val',surveysSelected)
    
  



  class List.Timeline extends App.Views.ItemView
    template: "timeline/list/templates/timeline"
    id: "timeline-visualization"
    timelineOptions:
      align: 'center'
      orientation: "top"                  
      height:400
      showCurrentTime: false
      autoResize: true
      zoomMax: 31536000000
      zoomMin: 31536000000 
    
    onShow:()->
      @setTimeline()
      @setOptions()
      @setItems()
      
      @listenTo @timeline, "select",(selected) =>
        selectedItem = @model.get('items').get(_.first(selected.items))
        unless _.isEmpty selectedItem
          @trigger "item:selected", {item: selectedItem}

    start:->
      moment(new Date()).subtract("months",6)
    
    end:-> 
      moment(new Date()).add("months",6)


    startEnd:()->
      {start: @start(), end: @end()}


    setTimeline:->
      @timeline = new vis.Timeline(@el,[],{})
      @model.set("timeline",@timeline)

    setItems:->
      @timeline.setItems(@model.get('visItems'))
    
    setOptions:->
      config = _.extend(@timelineOptions, @startEnd())
      @timeline.setOptions(config)
      
