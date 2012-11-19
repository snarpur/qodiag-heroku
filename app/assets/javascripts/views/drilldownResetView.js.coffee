class App.Views.DrilldownReset extends Backbone.View
  className:  "reset-drilldown-icn"
  tagName: "span"
  events:
    "click": "drillup"
  
  initialize:(chart)=>
    @chartEl = @options.chartEl
    @chart = @options.chart
    @model = new App.Lib.ChartEvents.Drilldown({chart:@chart})
    @model.on("change:drilldown",@showDrilldownReset)
    @render()

  drillup:=>
    @model.trigger("drillup")
    $(@el).setCssState("off","drilldown")
    new Highcharts.Chart(@chart)

  showDrilldownReset:(model)=>
    if model.get("drilldown")
      $(@el).setCssState("on","drilldown")
 
  render:=>
    @chartEl.prepend(@el)
