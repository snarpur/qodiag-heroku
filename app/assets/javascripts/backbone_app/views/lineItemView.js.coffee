App.Views.Timeline ||= {}

class App.Views.Timeline.LineItem extends Backbone.View
  
  tagName: "span"
  className: "item"
  events:
    "click": "show"

  initialize:->
   @line = @options.line
   @timeline = @options.timeline
   @model.view = @
   @setPosition()
   @setStatus()
   @model.bind("change:dialogView", @highlight)

  
  template:->
    JST['backbone_app/templates/lineItemTmpl']
  
  
  show:=>
    if @model.status() is "completed"
      @line.trigger("updateDialog", @model)

  
  setStatus:=>
    $(@el).addClass(@model.status())
    
  
  statusPosition:=>
    if @model.status() is "completed" then @model.get("completed")
    else @model.get("deadline")
  
  
  setPosition:=>
    pos = @timeline.positionOnLine(new Date(@statusPosition()))
    $(@el).css('left', "#{pos}px")
  
  
  highlight:=>
    if @model.get("dialogView")
      $(@el).addClass('open-dialog')
    else
      $(@el).removeClass('open-dialog')

  
  render:->
    $(@el).html(@template()(@model.toJSON()))
    @
