class App.Models.ColumnChart extends Backbone.Model
  urlRoot: "/responder_items/responses"
  
  initialize:->
    @url = ()->
      base = "#{@.urlRoot}/#{@get('id')}/column"
      if @get("columnMetrics")
        base = "#{base}/#{@get('columnMetrics')}"
      
      base

  
  chartWidth:->
    width =  App.Timeline.Dimensions.canvas_width * (@get('size') / @collection.totalSize())
    @get('chart').width = (width * 0.8) + 22


  renderTo:(view)->
    @get('chart').renderTo = @view.$("> div")[0]
    
  
  chartContainer:->
    @.view.$(" > div")[0]

  
  setFormatters:->
    formatter = new App.Lib.ChartFormatters.Column(@.attributes)
    formatter.setFormatters()
  

  responderItem:->
    @collection.responderItem()


  drillDownSetup:->
    if @.get('questionListDrilldown')
      drilldown = new App.Views.Drilldown({chart: @})


  removeActiveChartEl:(drilldown,callback)->
    if @get("activeChart") instanceof Backbone.View
      @get("activeChart").remove()
    else
      @get("activeChart").destroy()
    

  setup:(view)->
    @.view = view
    @chartWidth()
    @renderTo()
    @setFormatters()
    @drillDownSetup()
    highChart = new Highcharts.Chart(@.attributes)
    @set("activeChart",highChart)





class App.Collections.ColumnChart extends Backbone.Collection
  model: App.Models.ColumnChart
  
  

  initialize:(models,options)->
    @.options = options
    @setCurrentMetric(options.currentMetric)
    @on('reset', (models, options) =>
      @setMetricMenu(models, options)
      # @setFilters(models, options)
    )
  
    @url = ->
      url = "/responder_items/responses/:id/column"
      url = url.replace(/\:id/,@responderItemId())
      unless _.isEmpty(@currentMetric)
        url = "#{url}/#{@currentMetric}"
      url

  
  totalSize:->
    _.reduce(@pluck("size"),((memo, num)-> memo + num), 0)

  
  metricsMenu:->
    _.map(@at(0).attributes.chartMetrics,((i)->
      i.isActive = (i.query == @getCurrentMetric())
      i
    ),@)

  #filterSelects:->
  #  _.map(@at(0).attributes.chartFilters,((i)->
  #    i
  #  ),@)

  
  responderItemId:->
    @options.responderItem.get("id")

  
  responderItem:->
    @options.responderItem

  
  setMetricMenu:(models,options)->
    return if !options.chartMetrics? or @metricMenu?
    _.first(options.chartMetrics).isActive = true
    @metricMenu = new Backbone.Collection(options.chartMetrics)
    @listenTo(@metricMenu,"change:isActive",(model)-> @setCurrentMetric(model.get('name')))


  #setFilters:(models,options)->
  #  return if !options.chartFilters? or @filters?
  #  @filters = new Backbone.Collection(options.chartFilters)
    # @listenTo(@metricMenu,"change:isActive",(model)-> @setCurrentMetric(model.get('name')))
  
  
  getMetricMenu:->
    @metricMenu

  # getFilters:->
  #  @filters

  
  setCurrentMetric:(name)->
    @currentMetric = name

  
  getCurrentMetric:->
    @currentMetric || _.first(@at(0).attributes.chartMetrics).name
