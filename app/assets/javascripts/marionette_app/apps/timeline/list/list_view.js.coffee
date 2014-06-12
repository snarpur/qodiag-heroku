@Qapp.module "TimelineApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "timeline/list/templates/list_layout"
    regions:
      timelineRegion: "#timeline-region"
      # chartsRegion: "#charts-region"

    
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
      

  







  class List.ChartLayout extends App.Views.Layout
    template: "timeline/list/templates/chart_layout"
    

    

    onShow:->
      @chartsRegion.on "show", (chartView)=>
        menu = new List.ChartsMenu(collection: chartView.collection.getChartMenu())
        
        @listenTo menu, "childview:active", (options) =>
          @trigger "active:chart:selected", options
        
        @chartsMenuRegion.show menu

    regions:
      chartsRegion: "#charts-region"
      chartsMenuRegion: "#charts-menu-region"


    

  
  class List.ColumnChart extends App.Views.ItemView
    template: "timeline/list/templates/_column"
    id:->
      "chart-#{@options.index}"
    
    attributes: =>
      style: =>
        "float: left; width: #{@model.chartWidth()*90}%;"
    
    ui:
      chart: ".chart"
      drillup: ".drillup"
    
    events:
      "click .drillup": "drillup"


    modelEvents:
      "change:drilldownHistory": "updateChart"


      

    onShow:->
      @on "chart:updated", ()-> console.warn "yepp its happening"
      config = @model.get("chartOptions")
      config.chart.renderTo =  @ui.chart[0]
      @setFormatters(config)

      appView = @
      config.chart.appView = ()-> appView
          
      config.chart.events.drilldown = @drilldown
      @createChart(config) 
      
    setFormatters:(config)->
      formatter = new App.Components.Chart.Formatter.Column(config)
      formatter.setFormatters()



    updateChart:(options)->
      {config} = options

      @createChart(config)
      @triggerMethod("chart:updated")



    createChart:(config)->
      @currentChart = new Highcharts.Chart(config) 

    

    drilldown:(e)->
      @options.chart.appView().triggerMethod("drilldown",{e:e,chart:@})
 

    
    drillup:()=> 
      @model.back()


   
    toggleDrillupButton:-> 
      state =  if @model.isChartRoot() then 'hidden' else 'visible'
      @ui.drillup.css('visibility',state)
      
     
    onChartUpdated:-> 
      @toggleDrillupButton()
   

    onDrilldown:(options)->
      {e,chart} = options
      drilldownChart = @model.get("drilldownSeries")[e.point.name]
      @model.addChartToHistory(drilldownChart)

      
      # dummy = [
      #   {
      #     name: 'Tom Jones'
      #     stack: "base"
      #     color: "#186cdb"
      #     data: [{y: 1}, {y: 2}, {y: 5}]
      #   },
      #   {
      #     name: 'Normal'
      #     stack: "ref"
      #     color: "#99FF99"
      #     data: [{ y: 1}, {y: 4}, {y: 8}]
      #   },
      #   {
      #     name: 'Borderline'
      #     stack: "ref"
      #     color: '#E3D400'
      #     data: [{ y: 5}, {y: 6}, { y: 9}]
      #   },
      #   {
      #     name: 'Abnormal'
      #     stack: "ref"
      #     color: "#B10C01"
      #     data: [{y: 1}, {y: 4}, { y: 8}]
      #   }
      # ]
      # xAxis=
      #   xAxis:
      #     categories:["Tom Jones","Crazy","Comatose"]
      # dummyConf = _.extend(series: dummy, xAxis)
      # @model.addChartToHistory(dummyConf)

      
      
 




  class List.ColumnCharts extends App.Views.CollectionView
    itemView: List.ColumnChart
    className: 'row'




  class List.ChartsMenuItem extends App.Views.ItemView
    template: 'timeline/list/templates/_charts_menu_item'
    tagName: 'li'

    triggers: 
      "click": "active"

  


  class List.ChartsMenu extends App.Views.CollectionView
    itemView: List.ChartsMenuItem
    tagName: 'ul'
    className: 'nav nav-pills'


    



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

