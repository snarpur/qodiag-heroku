class App.Views.Drilldown extends Backbone.View
  className:  "reset-drilldown-icn"
  tagName: "span"
  events:
    "click": "drillup"
  
  initialize:(chart)=>
    @chartEl = @options.chartEl
    @chart = @options.chart
    @responderItem = @options.responderItem
    @rootView = @options.chartView
    @model = new App.Lib.ChartEvents.Drilldown({chart:@chart, responderItem: @responderItem})
    @model.on("change:paramsHistory", @setDrilldown)
    @render()

  setDrilldown:=>
    params = @model.getCurrentChartParams() 
    chartDiv = $("> div",@chartEl)
    if _.has(params,"chart")
      chartDiv.empty()
      new Highcharts.Chart(params)
    else
      list = new App.Views.QuestionResponseList(collection: params)
      chartDiv.empty()
      chartDiv.append(list.render().el)
      list.$el.stupidtable()
      list.adjustTable()
   
    @showDrilldownReset()

  drillup:=>
    App.Event.trigger("chartHeight",'')
    @model.trigger("drillup")

  showDrilldownReset:()=>
    if @model.get("paramsHistory").length > 1
      App.Event.trigger("drilldown",'on')
      $(@chartEl).setCssState("on","drilldown")
    else if @model.get("paramsHistory").length == 1
      App.Event.trigger("drilldown",'off')
      $(@chartEl).setCssState("off","drilldown")


 
  render:=>
    @chartEl.prepend(@el)
