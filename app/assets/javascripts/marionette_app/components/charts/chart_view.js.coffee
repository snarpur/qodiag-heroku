@Qapp.module "Components.Charts", (Charts, App, Backbone, Marionette, $, _) ->

  class Charts.ChartLayout extends App.Views.Layout
    template: "charts/templates/chart_layout"
    

    regions:
      chartsRegion: "#charts-region"
      chartsHeadingRegion: "#charts-heading-region"
      chartsMenuRegion: "#charts-menu-region"

    onShow:->
      @chartsRegion.on "show", (chartView)=>
        menu = new Charts.ChartsMenu(collection: chartView.collection.getChartMenu())
        @setHeading(chartView)      
        @listenTo menu, "childview:active", (options) =>
          @trigger "active:chart:selected", options
        
        @chartsMenuRegion.show menu

    
    setHeading:(chartsView)->
      heading = chartsView.groupTitle()
      $(@chartsHeadingRegion.el).append("<h4 class='modal-title'>#{heading}</h4>")
    

  
  class Charts.ColumnChart extends App.Views.ItemView
    template: "charts/templates/_column"
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


      
    initialize:->
      @chartSetUp(@model.get("chartOptions"))
      super
    

    onShow:->
      @createChart(@model.get("chartOptions")) 
      


    updateChart:(options)->
      @createChart(options.config)
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
      drilldownChart = @model.get("drilldownSeries")[options.e.point.name]
      @model.addChartToHistory(drilldownChart)

    
    
    setFormatters:(config)->
      formatter = new Charts.Formatter.Column(config)
      formatter.setFormatters()

    
    setDrilldown:(config)->
      appView = @
      config.chart.appView = ()-> appView

    
    setAppView:(config)->
      config.chart.events.drilldown = @drilldown
    

    setContainer:(config)->
      config.chart.renderTo =  @ui.chart[0]

    
    chartSetUp: (config)->
      @setDrilldown(config)
      @setAppView(config)
      @setFormatters(config)
      # @setContainer(config)
 




  class Charts.ColumnCharts extends App.Views.CollectionView
    itemView: Charts.ColumnChart
    className: 'row'


    groupTitle: =>
          title = _.chain(@collection.options.groupTitle)
            .map(((i)->@["title#{_(i[0]).capitalize()}"].call(@,i[1])),@)
            .flatten()
            .value()
          title.join(" ")
       
    titleSurvey:(name)->
      _(I18n.t("surveys.#{name}.name")).capitalize()
     
    titleSex:(sex)->
      I18n.t("surveys.terms.#{sex}")
     
    titleAge:(age)->
      str = "#{age} "
      str.concat(I18n.t("surveys.terms.age"))
     
    titleRespondent:(respondent)->
      I18n.t("surveys.terms.norm_reference.#{respondent}")

  
  class Charts.ChartsMenuItem extends App.Views.ItemView
    template: 'charts/templates/_charts_menu_item'
    className: 'btn-group'
    events: 
      "click": "active"
    
    templateHelpers:=>
      activeChart:=>
        btn = ['btn btn-info active','btn btn-white']
        if @options.index == 0 then btn[0] else btn[1] 

    
    initialize:->
      @listenTo @options.collectionView, "childview:active",(view)=>
        @removeClass(view)
      
      super
    
    ui:
      'nav':'button'
    
    removeClass:(view)->        
      if view.options.index != @options.index and @ui.nav.hasClass('active')
        @ui.nav.removeClass('active btn-info')
        @ui.nav.addClass('btn-white')



    active:->
      unless @ui.nav.hasClass('active')

        @ui.nav.removeClass('btn-white')
        @ui.nav.addClass('active btn-info')
        @triggerMethod("active")


  
  class Charts.ChartsMenu extends App.Views.CollectionView
    itemView: Charts.ChartsMenuItem
    className: 'btn-group btn-group-justified'
    childViewOptions:=>
      collectionView: @
  
    initialize:->
      @activeIndex ?= 0
      super


    



    
