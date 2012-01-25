App.Views.Timeline ||= {}

class App.Views.Timeline.HeadingsList extends Backbone.View
  
  id: "line-headings"
  events:
    "click button": "openSurveyMenu"
  
  initialize:()->
    @lines = @.options.lines
    @lines.bind("add", @renderHeading)
    @timeline = @.options.timeline
  
  template:->
    JST['templates/headingsListTmpl']
  
  openSurveyMenu:()=>
    console.log "opening survey menu SURVEYMENU VISIBILITY::",  @timeline.get('surveyMenuVisibility')
    @timeline.set({surveyMenuVisibility: 'open'})
  
  renderHeading:(line)=>
    heading = new App.Views.Timeline.LineHeading(model: line)
    @.$("ul").append(heading.render().el)
    
  render:->
    $(@el).html(@template()({}))
    @
