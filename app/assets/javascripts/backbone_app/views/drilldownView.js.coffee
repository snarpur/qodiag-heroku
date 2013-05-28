class App.Views.Drilldown extends Backbone.View
  className:  "reset-drilldown-icn"
  tagName: "span"
  events:
    "click": "drillup"
  
  initialize:(chart)=>
    @chart = @options.chart
    @model = new App.Lib.ChartEvents.Drilldown({chart:@chart})
    @model.on("change:paramsHistory", @setDrilldown)
    @render()

  
  setDrilldown:=>
    @chart.removeActiveChartEl()
    params = @model.getCurrentChartParams()
    chart = if @isChart(params) then params else new App.Views.QuestionResponseList(collection: params).render()

    if @isChart(chart)
      chart.chart.renderTo = @chart.chartContainer()
      highChart = new Highcharts.Chart(chart)  
      @chart.set("activeChart", highChart)
    else
      list = new App.Views.QuestionResponseList(collection: params)
      $(@chart.chartContainer()).append(list.render().el)
      @chart.set("activeChart",list)
      list.adjust()

    @showDrilldownReset(chart)

  
  drillup:=>
    App.Event.trigger("chartHeight",'')
    @model.drillup()

  isChart:(params)->
    params instanceof App.Models.ColumnChart || _.has(params, 'chart')
  
  isRootChart:->
    @model.get("paramsHistory").length == 1


  showDrilldownReset:(chart)=>
    unless @isRootChart()
      App.Event.trigger("drilldown",'on')
      @chart.set("drilldownStatus", 'on')
    else 
      App.Event.trigger("drilldown",'off')
      @chart.set("drilldownStatus", 'off')

  render:=>
    @chart.view.$el.prepend(@el)
