@Qapp.module "TimelineApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "timeline/list/templates/list_layout"
    regions:
      timelineRegion: "#timeline-region"

    
  class List.Timeline extends App.Views.ItemView
    template: "timeline/list/templates/timeline"
    id: "timeline-visualization"
    timelineOptions:
      width: "100%"
      align: 'center'
      orientation: "top"                  
      height: 500
      margin:
        axis: 80
        item: 30
      zoomMax: 31536000000
      zoomMin: 31536000000
    
    onShow:()->
      @showVis()
      @setOptions()

    start:->
      moment(new Date()).subtract("months",6)
    
    end:-> 
      moment(new Date()).add("months",6)


    startEnd:()->
      {start: @start(), end: @end()}


    showVis:->
      @timeline = new vis.Timeline(@el,[],{})
      @timeline.setItems(@model.get('visItems'))
  

    setOptions:->
      config = _.extend(@timelineOptions, @startEnd())
      @timeline.setOptions(config)

     

  # class List.Breadcrumb extends App.Views.ItemView
  #   template: "settings/list/templates/breadcrumb"
  #   tagName: 'ul'
  #   className: 'breadcrumb'
  #   triggers:
  #     'click a' : "back"

  # class List.Header extends App.Views.ItemView
  #   template: "settings/list/templates/header"
  #   className: 'content_title'
  #   tagName: "h1"

  # class List.Navigation extends App.Views.CollectionView
  #   itemView: List.NavigationItem
  #   className: 'tabs fullwidth'
  #   tagName: 'ul'

