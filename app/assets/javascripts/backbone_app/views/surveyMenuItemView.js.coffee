App.Views.SurveyMenuItem ||= {}

class App.Views.SurveyMenuItem extends Backbone.View  
  tagName: "li"
  className: 'state-hidden'
  
  events:
    "click": "setVisibility"

  initialize:()->
    @model.view = @
    @model.bind("change:visibility", @switchVisibility)

  template:->
    JST['backbone_app/templates/surveyMenuItemTmpl']

  switchVisibility:(model,value)=>
    @setInput(value)
    $(@el).setCssState(value)

  setVisibility:()=>
    if $(@el).cssState() is 'visible'
      @model.hideLine()
    else
      @model.addLine()
  
  setInput:(state)=>
    if state is 'visible'
      @.$("input").prop("checked", true)

  render:=>
    $(@el).html(@template()(@model.toJSON())) 
    @