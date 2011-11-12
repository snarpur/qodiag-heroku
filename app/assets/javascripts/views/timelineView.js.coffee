App.Views.Timeline ||= {}

class App.Views.Timeline.Canvas extends Backbone.View
  id: "canvas"

  initialize:->
    @model.set(items: @collection)
    @model.view = @
    @lines = new App.Collections.LineCollection()
    @lines.bind("change:currentDialogItem", @updateOpenLine)
    @lines.bind("change:newItem", @focusNewItem)
    @model.bind("change:current_position", @move)
    @model.bind("change:current_date", @goToDate)
    @lines.bind("add", @addHeader)
    @collection.bind("add", @updateLine)
  
  template:->
    JST["templates/timelineTmpl"]
  
  updateOpenLine:(line)=>
    unless line is null or !@model.getOpenLine()?
      if line.cid isnt @model.getOpenLine()?.cid
        @model.getOpenLine().trigger("updateDialog",null)
    @model.setOpenLine(line)
  
  focusNewItem:(obj, value)=>
    state = if value is "open" then "new-item" else ""
    $(@el).setCssState(state)

  renderContent:(items,id)=>
   
    params = 
      items: items
      survey_id: id
      timeline: @model
      name: @model.getSurveyAccessCode(id)

    @renderLines(params)

  renderLines:(params)=>
    line = new App.Models.Line(params)
    @lines.add(line)
    params = {model: line, timeline: @model}
    lineView = new App.Views.Timeline.Line(params)
    @.$("#tml-history").append(lineView.render().el)

  renderNavigation:()=>
    timelineNav = new App.Views.Timeline.Nav(model: @model)
    $(@el).prepend(timelineNav.render().el)
    
  move:=>
    @.$("#tml-history").css("margin-left": @model.get("current_position"))
  
  goToDate:=>
    @model.goToDate()
  
  sortCollection:=>
    @collection.groupBy((item)-> item.get("survey_id"))

  addHeader:(item)=>
    heading = new App.Views.Timeline.Headings(model: item)
    @.$('#tml-body > ul').append(heading.render().el)
    

  render:=>
    $(@el).html(@template()(@model.toJSON()))
    @renderNavigation()
    _.each(@sortCollection(), @renderContent)
    @model.set(current_date: Date.today())
    @