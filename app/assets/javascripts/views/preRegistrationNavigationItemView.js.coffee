App.Views.PreRegistrationNavigationStep ||= {}

class App.Views.PreRegistrationNavigationStep extends Backbone.View


  events:
    "click span": "setStep"

  initialize:->
    @.step_no = @.options.step_no
    @step_name = @.options.step_name
  

  attributes: =>
    @setClass()
  
  setStep:(e)=>
    @model.set({current_step_no: @step_no})
  
  setClass:->
    {class: "current-step"}  if @.options.step_no == @model.get("current_step_no")

  template:->
    JST['templates/preRegistrationNavigationStepTmpl']

  render:=>
    $(@el).html(@template()({step_no: @step_no, step_name: @step_name}))
    @

