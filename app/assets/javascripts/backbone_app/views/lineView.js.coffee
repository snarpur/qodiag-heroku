class App.Views.Timeline.Line extends Backbone.View
  
  className: "line state-closed"
  
  defaults: {
    dialog: ".chart-dialog"
  }

  initialize:->
    @timeline = @options.timeline
    @model.view = @
    @model.on("change:previousDialogItem", @removeDialog)
    @model.on("change:currentDialogItem", @changeLineState)
    @model.on("change:newItemOverlayState", @newItemOverlayState)
    @model.on("change:menuItem", @removeItems)
    @model.on("remove", @removeLine)
    @model.on('change:currentChartHeight',@resizeLine)
    @model.get('items').on("add", @renderLineItems)

  
  template:->
    JST['backbone_app/templates/lineTmpl']

  
  changeLineState:(line,item)=>
    overlayState = "charts" if item
    state = if item then 'open' else 'closed'
    $(@el).setCssState(state)
    $(@el).setCssState(overlayState, 'overlay')

    if item
      @renderDialog(@model.currentDialogItem())
    else
      @model.clearDialogItem()


  
  resizeLine:(line)=>
    height = line.get('currentChartHeight')
    height = if height == '' then '' else height + App.Timeline.Dimensions.line_height 
    @.$el.css("height", height)

  
  removeDialog:(item)=>
    if @model.previousDialogItem()?
      @model.previousDialogView().remove()
      @model.previousDialogItem().set({dialogView: null})

  
  renderDialog:(item)=>
    dialog = new App.Views.Timeline.ItemDialog(line: @model, model: item, timeline: @timeline)
    $(@el).append(dialog.render().el)
    dialog.renderColumnCharts()
    
  
  renderLineItems: => 
    @.$(".line-items").empty()
    _.each(@model.get('items').models ,@renderLineItem)
  
  
  renderLineItem:(item)=>
    lineItem = new App.Views.Timeline.LineItem(model: item, line: @model, timeline: @timeline)
    @.$(".line-items").append(lineItem.render().el)

  
  # itemDetailDialog:() =>

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
