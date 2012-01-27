App.Views.Timeline ||= {}

class App.Views.Timeline.Canvas extends Backbone.View
  id: "canvas"

  initialize:->
    @model.set(items: @collection)
    @model.view = @
    @lines = @model.get('lines')
    @surveyMenu = @model.get('surveyMenu')
    @lines.bind("change:currentDialogItem", @updateOpenLine)
    @lines.bind("change:newItemOverlayState", @focusNewItem)
    @model.bind("change:current_position", @move)
    @model.bind("change:current_date", @goToDate)
    @lines.bind("add", @appendLine)

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
  
  appendLine:(line)=>
    lineView = new App.Views.Timeline.Line({model: line, timeline: @model})
    @.$("#tml-history").append(lineView.render().el)

  renderNavigation:()=>
    timelineNav = new App.Views.Timeline.Nav(model: @model)
    $(@el).prepend(timelineNav.render().el)
    
  renderSurveyMenu:()=>
    surveyMenuView = new App.Views.SurveyMenu(lines: @lines, timeline: @model)
    @.$("#tml-body").prepend(surveyMenuView.render().el)
    surveyMenuView.renderMenuItems()
  
  renderHeadingsList:()=>
    headingsList = new App.Views.Timeline.HeadingsList(lines: @lines, timeline: @model).render().el
    @model.set({headingsList: headingsList})
    @.$('#tml-body').append(headingsList)
  
  move:=>
    @.$("#tml-history").css("margin-left": @model.get("current_position"))
  
  goToDate:=>
    @model.goToDate()
  
  createSortedLinesCollection:=>
    that = @
    ids = _.uniq(@collection.pluck('survey_id'))
    _.map(ids, (id) -> 
      models =  that.filterBySurveyId(id)
      params = 
        survey_id: id
        items: new App.Collections.ResponderItemsCollection(models)
        name: that.model.getSurveyAccessCode(id)
        timeline: that.model
      new App.Models.Line(params)
    )
    
  filterBySurveyId:(id)=>
    @collection.filter((item) -> 
      item if item.get("survey_id") is id
    )
  
  
  render:=>
    $(@el).html(@template()(@model.toJSON()))
    @renderNavigation()
    @renderSurveyMenu()
    @renderHeadingsList()
    @lines.add(@createSortedLinesCollection())
    @model.set(current_date: Date.today())
    @