class App.Views.DrilldownReset extends Backbone.View
  className:  "reset-drilldown-icn"
  tagName: "span"
  events:
    "click": "drillUp"
  
  initialize:(chart)=>
    @model = new App.Lib.ChartEvents.Drilldown({chart:@options.chart,view:@})
    @model.setDrilldownEvent()
    @model.on("change:drilldown",@showDrilldownReset)

  drillUp:=>
    @model.set("drilldown",null)
    $(@el).setCssState("off","drilldown")

  showDrilldownReset:(model)=>
    if model.get("drilldown")
      $(@el).setCssState("on","drilldown")
 
  render:=>
    @
