App.Views.SurveyMenu ||= {}

class App.Views.SurveyMenu extends Backbone.View
  
  id: "survey-menu"
  className: "iphone-toggle-buttons state-closed"
  events: 
    "click button": "closeMenu"


  initialize:()->
    @lines = @.options.lines
    @timeline = @.options.timeline
    @surveys = @timeline.fillSurveyMenu()
    @lines.bind("add", @setToVisible)
    @timeline.bind("change:surveyMenuVisibility", @setMenuVisibility)

  template:->
    JST['templates/surveyMenuTmpl']

  renderItem:(item)=>
    item.set({lines: @lines})
    menuItem = new App.Views.SurveyMenuItem(model: item, timeline: @timeline)
    @.$("ul").prepend(menuItem.render().el)

  setToVisible:(line)=>
    menuItem = @surveys.get(line.get("survey_id"))
    menuItem.showLine(line)
  
  closeMenu:=>
    @timeline.set({surveyMenuVisibility: 'closed'})
  
  setMenuVisibility:(a)=>
    $(@el).setCssState(@timeline.get('surveyMenuVisibility'))

  renderMenuItems:()=>
    _.each(@surveys.models, @renderItem)

  render:=>
    $(@el).html(@template()({})) 
    @