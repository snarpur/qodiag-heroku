App.Views.SurveyMenuItem ||= {}

class App.Views.SurveyMenuItem extends Backbone.View  
  tagName: "li"
  className: "state-hidden"
  
  events:
    "click input": "setVisibility"

  initialize:()->
    @model.view = @
    @model.bind("change:visibility", @switchVisibility)

  template:->
    JST['templates/surveyMenuItemTmpl']

  switchVisibility:(model,value)=>
    @setInput(value)
    $(@el).setCssState(value)

  setVisibility:()=>
    console.log @.$("input")
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