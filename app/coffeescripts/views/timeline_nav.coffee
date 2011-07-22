App.Views.Timeline ||= {}

class App.Views.Timeline.Nav extends Backbone.View

  tagName: "ul"
  className: "tml-history-nav"

  events:
    "click ul li:nth-child(1)" : "backwards"
    "click ul li:nth-child(2)" : "forwards"


  initialize: ->
      @render()

  forwards: ->
    @model.step(-2)

  backwards: ->
    @model.step(2)

  template: ->
    return JST['timeline_nav']

  render:=>
    $(@el).html(@template()(@model.toJSON()))
    $("#canvas").prepend(@el)
    @