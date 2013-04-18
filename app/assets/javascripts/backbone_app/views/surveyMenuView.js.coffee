App.Views.SurveyMenu ||= {} 

class App.Views.SurveyMenu extends Backbone.View
  
  id: "survey-menu"
  class: 'dropdown'

  initialize:()->
    @lines = @.options.lines
    @timeline = @.options.timeline
    @surveys = @timeline.fillSurveyMenu()
    @lines.bind("add", @setToVisible)

  template:->
    JST['backbone_app/templates/surveyMenuTmpl']

  renderItem:(item)=>
    item.set({lines: @lines})
    menuItem = new App.Views.SurveyMenuItem(model: item, timeline: @timeline)
    @.$("ul").prepend(menuItem.render().el)

  setToVisible:(line)=>
    if @popover
      @popover.popover('destroy')
    @$el.removeClass("state-empty-instructions")
    menuItem = @surveys.get(line.get("survey_id"))
    menuItem.showLine(line)


  showEmptyInstructions:->
    if @timeline.get('lines').size() is 0 
      @$el.setCssState("empty-instructions")
      @popover =  @$('a.popover-target').popover('show')
      

  renderMenuItems:()=>
    _.each(@surveys.models, @renderItem)

  render:=>
    $(@el).html(@template()({})) 
    @showEmptyInstructions()
    @