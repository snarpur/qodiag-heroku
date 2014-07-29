App.Views.Timeline.LineHeading ||= {}

class App.Views.Timeline.LineHeading extends Backbone.View
  
  tagName: "li"

  events:
    "click span.new-item": "newItem"
  
  initialize:->
    @model.headingView = @
    @model.bind("remove", @removeHeader)
  
  
  newItem:=>
    @model.set(newItemOverlayState:'open')

  
  removeHeader:(line)=>
    $(@el).remove()
  

  template:->
    JST['backbone_app/templates/headingsTmpl']
  
  	
  render:->
    $(@el).html(@template()(@model.toJSON()))
    @
