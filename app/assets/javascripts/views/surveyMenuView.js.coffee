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
    JST['templates/surveyMenuTmpl']

  renderItem:(item)=>
    item.set({lines: @lines})
    menuItem = new App.Views.SurveyMenuItem(model: item, timeline: @timeline)
    @.$("ul").prepend(menuItem.render().el)

  setToVisible:(line)=>
    menuItem = @surveys.get(line.get("survey_id"))
    menuItem.showLine(line)

  renderMenuItems:()=>
    _.each(@surveys.models, @renderItem)

  render:=>
    $(@el).html(@template()({})) 
    @