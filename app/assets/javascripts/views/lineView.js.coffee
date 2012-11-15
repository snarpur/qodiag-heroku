# App.Views.Timeline ||= {}

class App.Views.Timeline.Line extends Backbone.View
  
  className: "line state-closed"
  
  defaults: {
    dialog: ".chart-dialog"
  }

  initialize:->
    @timeline = @options.timeline
    @model.view = @
    @model.bind("change:previousDialogItem", @removeDialog)
    @model.bind("change:currentDialogItem", @changeLineState)
    @model.bind("change:newItemOverlayState", @newItemOverlayState)
    @model.bind("change:menuItem", @removeItems)
    @model.bind("remove", @removeLine)
    @model.get('items').bind("add", @renderLineItems)

  
  template:->
    JST['templates/lineTmpl']

  changeLineState:(item)=>
    currentDialog = @model.currentDialogItem()
    if currentDialog is null
      $(@el).setCssState("closed")
      $(@el).setCssState('','overlay')  
      @model.clearDialogItem()
    else
      $(@el).setCssState("open")
      $(@el).setCssState('charts','overlay')  
      @renderDialog(@model.currentDialogItem())

  removeDialog:(item)=>
    if @model.previousDialogItem()?
      @model.previousDialogView().remove()
      @model.previousDialogItem().set({dialogView: null})

  renderDialog:(item)=>
    dialog = new App.Views.Timeline.ItemDialog(line: @model, model: item, timeline: @timeline)
    $(@el).append(dialog.render().el)
    dialog.renderCharts()
  
  renderLineItems: => 
    @.$(".line-items").empty()
    _.each(@model.get('items').models ,@renderLineItem)
  
  renderLineItem:(item)=>
    lineItem = new App.Views.Timeline.LineItem(model: item, line: @model, timeline: @timeline)
    @.$(".line-items").append(lineItem.render().el)

  newItemOverlayState:(self,state)=>
    overlayState = "new-item" if state is 'open'
    $(@el).setCssState(state)
    $(@el).setCssState(overlayState, 'overlay') 
  
  renderAddItemOverlay:=>
    overlay = new App.Views.Timeline.NewItem(model: @model, timeline: @timeline)
    $(@el).append(overlay.render().el)
  
  removeItems:=>
    if @model.get('menuItem') is null
      @model.removeItems()
  
  removeLine:=>
    $(@el).remove()

  render:=>
    $(@el).html(@template()(@model.toJSON()))
    @renderAddItemOverlay()
    @renderLineItems()
    @
