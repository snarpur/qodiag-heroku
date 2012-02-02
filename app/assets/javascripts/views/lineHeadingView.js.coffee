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
    JST['templates/headingsTmpl']
  	
  render:->
    console.log "rendering line, ", @
    $(@el).html(@template()(@model.toJSON()))
    @
