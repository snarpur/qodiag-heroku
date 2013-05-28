App.Views.Timeline ||= {}

class App.Views.Timeline.Nav extends Backbone.View

  tagName: "nav"

  events:
    "click li:nth-child(1)" : "forward"
    "click li:nth-child(2)" : "backward"

  forward: ->
    @model.step(-6)

  backward: ->
    @model.step(6)
  
  template: ->
    return JST['backbone_app/templates/timelineNavTmpl']

  render:=>
    $(@el).html(@template()(@model.toJSON()))
    @