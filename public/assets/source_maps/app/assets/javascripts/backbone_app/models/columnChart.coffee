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
    console.log JSON.stringify @attributes
    console.warn @attributes
    highChart = new Highcharts.Chart(@.attributes)
    @set("activeChart",highChart)





class App.Collections.ColumnChart extends Backbone.Collection
  model: App.Models.ColumnChart
  
  

  initialize:(models,options)->
    @.options = options
    @setCurrentMetric(options.currentMetric)
    @on('reset', (models,options)=> 
      @setMetricMenu(models,options)
      @setFilters(models,options)
    )
  
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

  
  totalSize:->
    _.reduce(@pluck("size"),((memo, num)-> memo + num), 0)

  
  metricsMenu:->
    _.map(@at(0).attributes.chartMetrics,((i)->
      i.isActive = (i.query == @getCurrentMetric())
      i
    ),@)

  filters:->
    _.map(@at(0).attributes.chartFilters,((i)->
      i
    ),@)


  
  responderItemId:->
    @options.responderItem.get("id")

  
  responderItem:->
    @options.responderItem

  
  setMetricMenu:(models,options)->
    return if !options.chartMetrics? or @metricMenu?
    _.first(options.chartMetrics).isActive = true
    @metricMenu = new Backbone.Collection(options.chartMetrics)
    @listenTo(@metricMenu,"change:isActive",(model)-> @setCurrentMetric(model.get('name')))

  setFilters:(models,options)->
    return if !options.chartFilters? or @selectFilter?
    @selectFilter = new Backbone.Collection(options.chartFilters)
    @listenTo(@selectFilter,'change:normReferenceId',(model)-> @setNormReferenceId(model.get('normReferenceId')))

  
  getMetricMenu:->
    @metricMenu

  getFilters:->
    @selectFilter

  setCurrentMetric:(name)->
    @currentMetric = name

  setNormReferenceId:(id)->
    @normReferenceId = id

  
  getCurrentMetric:->
    @currentMetric || _.first(@at(0).attributes.chartMetrics).name
