class App.Views.FormRenderer extends Backbone.View
 
  id: "form-wizard"
  className: "form-base"

  events:
    "click button.submit-btn": "validateForm"

  initialize:()=>
    @model = if @.options.model? then @.options.model else new App.Models.FormRenderer(@.options.model_attributes)
    @router = @.options.router
    @
  
  template:->
    JST['templates/multistepFormTmpl']

  validateForm:=>
    errors = @model.get('form').commit()
    if _.isEmpty(errors)
      @model.on("destructionComplete",@prepareSubmit)
      @model.destroyInQueue()

  prepareSubmit:=>
    @model.off("destructionComplete")
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
        if (!_.isEmpty(response.errors))
          view.renderSteps()
        else if view.model.is_last_step() && view.model.redirectUrl()?
          #TODO: Set spinning icon to indicate redirect
          window.location.href = view.model.redirectUrl()
        else
          view.router.navigate("step/s#{response.next_step_no}/i#{response.root_object_id}",{trigger: true,replace: true})      
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
    step = new App.Views.MultistepFormNavigation({model: @model})
    $(@el).prepend(step.render().el)
  

  render:=>
    $(@el).html(@template()(@model.toJSON()))
    @renderSteps()
    @renderStepNavigation()
    @
  


