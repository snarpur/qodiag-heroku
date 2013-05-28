class App.Views.ColumnChartItem extends App.Marionette.ItemView
  template: 'chartsTmpl'
  className: 'chart'
  onRender: ->
    @model.setup(@)
    @model.on('change:drilldownStatus', @setDrilldown)
  onClose:->
    if @model.get('activeChart') instanceof Highcharts.Chart
      @model.get('activeChart').destroy()

  setDrilldown:(model,status,options)=>
    @$el.setCssState(status,"drilldown")





class App.Views.ColumnChartCollection extends App.Marionette.CompositeView  
  template: 'emptyTmpl'
  className: 'column-chart'
  itemView: App.Views.ColumnChartItem
  onRender:()->
    if @menuView
      @$el.prepend(@menuView.render().el)


  initialize:(options)->
    @menu = options.collection.getMetricMenu()
    if @menu?
      @menuView = new App.Views.MetricsMenuList({collection: @menu})
      @listenTo(@menu,'change:isActive',@fetchMetricResult)

  fetchMetricResult:(model)=>
    view = @
    callbacks=
      success:(collection,response)->
        collection.reset(response.charts,{chartMetrics: response.chartMetrics})
        view.menuView.render()
      error:(collection,xhr)->
        throw "could no get collection in App.Views.ColumnChartCollection:fetchMetricResult"
      silent: true

    @collection.fetch(callbacks)
