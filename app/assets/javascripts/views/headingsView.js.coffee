App.Views.Timeline ||= {}

class App.Views.Timeline.Headings extends Backbone.View
  
  tagName: "li"

  events:
    "click span.new-item": "newItem"
  
  initialize:->
    @model.headingView = @
  
  newItem:=>
    @model.set(newItemOverlayState:'open')

  template:->
    JST['templates/headingsTmpl']
  	
  render:->
    $(@el).html(@template()(@model.toJSON()))
    @
