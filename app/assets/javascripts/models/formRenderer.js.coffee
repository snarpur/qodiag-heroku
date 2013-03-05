class App.Models.FormRenderer extends Backbone.Model

  initialize:=>
    @createFormMetaData()
    @createFormModel()
    @.destructionQueue = new Backbone.Collection

    @listenTo(App.Event,"addToDestructionQueue",@addToDestructionQueue)
    @listenTo(App.Event,"removeFromDestructionQueue",@removeFromDestructionQueue)

    @on("change:formModel",@createFormModel)
    @on("change:formMetaData",@createFormMetaData)
    @.paramRoot = @.get("formModel").get("paramRoot")

    @.url = ()->
      "#{@.get('formModel').url()}/step/#{@currentStepNo()}"

  createFormModel:=>
    formModel = new App.Models.Base(_.extend(@.get('formModel'),{schema: @get('schema')}))
    @.set("formModel",formModel,{silent: true})
    
  createFormMetaData:=>
    @set('formMetaData',new Backbone.Model(@get("formMetaData")),{silent: true}) 

  nextStep:=>
    @get("formMetaData").set("currentStep",@.currentStepNo() + 1) 
    @trigger("change:step",@)

  formModelId:=>
    @get("formModel").get("id")

  formTemplate:=>
    @.get('formMetaData').get('formTemplate')
  
  currentStepNo:=>
    (Number)(@get('formMetaData').get('currentStep'))
    
  stepLength:=>
    @.get("formMetaData").get('stepNames').length

  onLastStep:=>
    @currentStepNo() == @stepLength()

  i18nStepName:(stepName)->
    I18n.translate("forms.#{@formTemplate()}.steps.#{stepName}")

  urlOnComplete:()->
    location = "#{window.location.protocol}//#{window.location.host}"
    if @formTemplate().match(/invitation/)
      subjectId = @get("formModel").get("subject").get("id")
      "#{location}/people/#{subjectId}"
    else if @formTemplate().match(/registration/)
      "#{location}/users"

  toJSON:=>
    @get("formModel").toJSON()

  addToDestructionQueue:(model)=>
    @.destructionQueue.add(model)

  removeFromDestructionQueue:(model)=>
    @.destructionQueue.remove(model)

  triggerIfComplete:=>
   if @.destructionQueue.length == 0
      @.trigger("destructionComplete")


  destroyInQueue:=>
    @.triggerIfComplete()
    renderer = @
    callbacks = 
      success: (model,response)->  
        renderer.triggerIfComplete()
      error: (model,response)->
        throw "ERROR delete FAILED in formRenderer.js.coffee:destroyInQueue()" 
    
    @.destructionQueue.each(((i)->
      model = @.destructionQueue.pop()
      model.destroy(callbacks)
    ),@)
    