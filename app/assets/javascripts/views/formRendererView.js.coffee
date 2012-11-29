class App.Views.FormRenderer extends Backbone.View
 
  id: "form-wizard"

  events:
    "click button": "validateForm"

  initialize:()=>
    @model = new App.Models.FormRenderer(@.options.model_attributes)
    @model.on("change:current_step_no", @move)
    @
  
  template:->
    JST['templates/preRegistrationTmpl']
 
  move:=>
    console.log "moving",arguments

  validateForm:=>
    errors = @model.get('form').commit()
    if _.isEmpty(errors)
      @model.on("destructionComplete",@prepareSubmit)
      @model.destroyInQueue()

  prepareSubmit:=>
    @model.off("destructionComplete")
    console.warn @model.url()
    @model.get('rootModel').url = @model.url()
    @.trigger("submitForm",@model.url())
  
  submitForm:(content)=>
    @model.get("rootModel").off("readyToSave")
    @model.get("rootModel").save(content,@submitCallbacks())

  submitCallbacks:=>
    view = @
    callbacks=
      success:(model, response) ->
        view.model.set(response) 
        view.renderSteps()
      error:(model, response) ->
        console.log "error", model
  
  bindForm:(form, model)=>
    _.each(form.fields, (v,k)->
      v.model.bindToForm(v.form)
    )

  renderSteps:=>
    rootModel = @model.createRootModel()
    form = new Backbone.Form({ model: rootModel}).render()
    @model.set("form",form)
    rootModel.set("formHandler",@)
    rootModel.on("readyToSave",@submitForm)
    @.$('#wizard-fields').empty()
    @.$('#wizard-fields').append(form.el)
    @bindForm(form,rootModel)  

  renderStepNavigation:=>
    view = @
    _.each(@model.get("steps"),(v,i)->
      step = new App.Views.PreRegistrationNavigationStep({model: view.model, step_no: i + 1, step_name: v})
      $(".wizard-nav",view.el).append(step.render().el)
    )

  render:=>
    $(@el).html(@template()(@model.toJSON())) 
    @renderSteps()
    # @renderStepNavigation()
    @
  


