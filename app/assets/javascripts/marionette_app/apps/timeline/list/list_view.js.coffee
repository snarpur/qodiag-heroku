@Qapp.module "TimelineApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "timeline/list/templates/list_layout"
    regions:
      timelineRegion: "#timeline-region"
      # chartsRegion: "#charts-region"

    triggers:
      "click .add-survey"  : "add:survey:clicked"
    
  class List.Timeline extends App.Views.ItemView
    template: "timeline/list/templates/timeline"
    id: "timeline-visualization"
    timelineOptions:
      width: "100%"
      align: 'center'
      orientation: "top"                  
      height: 500
      # margin:
      #   axis: 80
      #   item: 30
      zoomMax: 31536000000
      zoomMin: 31536000000
    
    onShow:()->
      @setTimeline()
      @setOptions()
      
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
      @timeline = new vis.Timeline(@el,@model.get('visItems'),{})
      
    setOptions:()->
      config = _.extend(@timelineOptions, @startEnd())
      @timeline.setOptions(config)
      

  







  
  
