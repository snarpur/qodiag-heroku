class App.Views.FormRenderer extends Backbone.View
 
  id: "form-wizard"
  className: "form-base"

  events:
    "click button.submit-btn": "validateForm"


  initialize:()=>
    @router = @.options.router
    @listenTo(@model,"destructionComplete",@submitForm)
    @
  

  template:->
    JST['templates/multistepFormTmpl']


  validateForm:=>
    errors = @form.commit()
    if _.isEmpty(errors)
      @model.destroyInQueue()
      

  submitForm:()=> 
    @model.save(@model.toJSON(),@submitCallbacks())


  submitCallbacks:->
    view = @
    callbacks=
      success:(model,response) ->
        if !(_.isEmpty(response.errors))
          view.renderSteps()
          alert("server error #{JSON.stringify response.errors}")
        else if view.model.onLastStep()
          window.location.href = view.model.urlOnComplete()
        else
          view.model.nextStep()
      error:(model, response) ->
        throw  "coudn not save #{model} error"
  

  bindForm:(form, model)=>
    _.each(form.fields, (v,k)->
      v.model.bindToForm(v.form)
    )


  renderSteps:=>
    rootModel = @model.get("formModel")
    @form = new Backbone.Form({ model: rootModel}).render()
    $(@form.el).addClass("form-horizontal")
    @.$('#wizard-fields').empty()
    @.$('#wizard-fields').append(@form.el)
    rootModel.set("form",@form)
 


  renderStepNavigation:=>
    step = new App.Views.MultistepFormNavigation({model: @model})
    @$(".#{step.className}").remove()
    $(@el).prepend(step.render().el) 


  renderForm:()=>
    @renderSteps()
    @renderStepNavigation()
  

  render:=>
    $(@el).html(@template()({}))
    @
  


