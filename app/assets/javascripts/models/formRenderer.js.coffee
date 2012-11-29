class App.Models.FormRenderer extends Backbone.Model

  initialize:=>
    @.destructionQueue = new Backbone.Collection
    @.url = ()->
      @.get("root_url")

  createRootModel:=>
    params = _.extend({schema: @.get("schema")},@.get("form_content"),registrationModel:@)
    @.set("rootModel",new App.Models.FormRootObject(params))
    @.get('rootModel')

  addToDestructionQueue:(model)=>
    @.destructionQueue.add(model)

  removeFromDestructionQueue:(model)=>
    @.destructionQueue.remove(model)

  destructionComplete:=>
    @.trigger("destructionComplete")

  destroyInQueue:=>
    signalComplete = _.after(@.destructionQueue.length, @destructionComplete)
    callbacks = 
      success: (model,response)->
        signalComplete
      error: (model,response)->
        console.warn "ERROR delete FAILED",response if console
    
    @.destructionQueue.each(((i)->
      model = @.destructionQueue.pop()
      model.destroy(callbacks)
    ),@)
    











