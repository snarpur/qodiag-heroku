class App.Views.PreRegistration extends Backbone.View

  id: "form-wizard"

  events:
    "click button": "submitForm"

  initialize:()=>
    @model = new App.Models.PreRegistration(@.options.model_attributes)
    @model.on("change:current_step_no", @move)
    # @model.on("change:form_content", @renderSteps)
    @model.processFormSchema()
    # console.log @model.get("form_content").inverse_relationships.schema.relation
    @

  template:->
    JST['templates/preRegistrationTmpl']

  
  move:=>
    console.log "moving",arguments


  submitForm:=>
    errors = @.form.commit()
    if _.isEmpty(errors)
      json = @.form.model.formAttributes()
      form = new App.Models.PreRegistrationForm(json)
      form.url = @model.url()
      form.save(json,@submitCallbacks())


  submitCallbacks:=>
    callbacks=
      success:(model, response) ->
        console.log "success:: ",model
      error:(model, response) ->
        console.log "error", model
  

  bindForm:(form, model)=>
    fieldStr = @getFields(model.get("schema"))
    console.log "fieldStr",fieldStr
    _.each(fieldStr, (i)->
      field = i
      model.on("#{i}:change", (k,y) ->
        value = {}
        value[field] = y
        form.setValue(value)
      )
    )
    

  renderSteps:=>
    params = _.extend({schema: @model.get("schema")},@model.get("form_content"))
    rootModel = new App.Models.PreRegistrationForm(params)
    form = new Backbone.Form({ model: rootModel}).render()
    @.form = form
    @.$('#wizard-fields').append(form.el)
    # @bindForm(form,rootModel)  
    

  getFields:(schema,name,destination)=>
    view = @
    destination ?= []
    _.each(schema ,(v,k)->
      if _.has(v,"type") && v.type == "NestedModel"
        model_name = if !name? then k else "#{name}.#{k}" 
        view.getFields(v.schema,model_name,destination)
      else
        #destination.push "#{name}.#{k}"
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
  


