class App.Views.DrilldownReset extends Backbone.View
  className:  "reset-drilldown-icn"
  tagName: "span"
  events:
    "click": "drillup"
  
  initialize:(chart)=>
    @chartEl = @options.chartEl
    @chart = @options.chart
    @model = new App.Lib.ChartEvents.Drilldown({chart:@chart})
    # @model.on("change:previousChart",@showDrilldownReset)
    @model.on("change:paramsHistory", @setDrilldown)
    @render()

  setDrilldown:=>
    params = @model.getCurrentChartParams()
    console.log params
    new Highcharts.Chart(params)
    console.log @model.get("previousChart")
    @showDrilldownReset()

  drillup:=>
    @model.trigger("drillup")

  showDrilldownReset:()=>
    if @model.get("paramsHistory").length > 1
      $(@el).setCssState("on","drilldown")
    else if @model.get("paramsHistory").length == 1
      $(@el).setCssState("off","drilldown")

 
  render:=>
    @chartEl.prepend(@el)
