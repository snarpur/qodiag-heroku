class App.Views.PreRegistration extends Backbone.View

  id: "form-wizard"

  events:
    "click button": "validateForm"

  initialize:()=>
    @model = new App.Models.PreRegistration(@.options.model_attributes)
    @model.on("change:current_step_no", @move)
    @

  template:->
    JST['templates/preRegistrationTmpl']

  
  move:=>
    console.log "moving",arguments


  validateForm:=>
    errors = @.form.commit()
    if _.isEmpty(errors)
      @.form.model.url = @model.url()
      @.trigger("submitForm",@model.url())
      # @.form.model.save(@.form.model.toJSON(),@submitCallbacks())

  submitForm:(content)=>
    console.log "submitting in VIEW", content,arguments
    @.form.model.unset("formHandler",null)
    @.form.model.save(content,@submitCallbacks())
  
  submitCallbacks:=>
    callbacks=
      success:(model, response) ->
        console.log "success:: ",model
      error:(model, response) ->
        console.log "error", model
  

  bindForm:(form, model)=>
    console.warn "::TOP :: ", "FORM", form,"  MODEL  ",model
    _.each(form.fields, (v,k)->
      # v.model.bindToForm(v.form)
    )

      

      # _.each(nestedModel.getNestedModelNames(),(n)->
      #     console.log nestedModel.get(n.name)
      # )

      # _.each(fields,(i)->
      #   v.editor.on("#{i}:change", (nestedForm,editor) ->
      #     console.log "CHANGING #{i}",nestedForm, editor
      #     nestedModel.set(i,editor.getValue())
  
      #   )
      # )
    # )
    

  renderSteps:=>
    params = _.extend({schema: @model.get("schema")},@model.get("form_content"))
    rootModel = new App.Models.PreRegistrationForm(params)
    rootModel.set("formHandler",@)
    rootModel.on("readyToSave",@submitForm)
    form = new Backbone.Form({ model: rootModel}).render()
    console.log "------------- APPENDING FORM -------------"
    @.form = form
 
   
    @.$('#wizard-fields').append(form.el)
    @bindForm(form,rootModel)  
    

  getFields:(schema,name,destination)=>
    view = @
    destination ?= []
    _.each(schema ,(v,k)->
      if _.has(v,"type") && v.type == "NestedModel"
        model_name = if !name? then k else "#{name}.#{k}" 
        view.getFields(v.schema,model_name,destination)
      else
        destination.push k
    )
    destination


  renderStepNavigation:=>
    view = @
    _.each(@model.get("steps"),(v,i)->
      step = new App.Views.PreRegistrationNavigationStep({model: view.model, step_no: i + 1, step_name: v})
      $(".wizard-nav",view.el).append(step.render().el)
    )


  render:=>
    $(@el).html(@template()(@model.toJSON())) 
    @renderSteps()
    @renderStepNavigation()
    @
  


