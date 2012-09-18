class App.Models.PreRegistration extends Backbone.Model

  initialize:=>
    @.destructionQueue = new Backbone.Collection
    @.set({responder_item: new App.Models.ResponderItem(@.get("responder_item"))})
    @.on("change:responder_item",@setResponderItem)
    @.urlRoot = "/pre_registrations/:responder_item_id/edit/step/"
    @.url = ()->
      base = @.urlRoot.replace(/:responder_item_id/, @responder_item_id())
      "#{base}#{'' if _.endsWith(base,'/')}#{encodeURIComponent(@.get('current_step_no'))}"
  
  setResponderItem:=>
    @.set({responder_item: new App.Models.ResponderItem(@.get("responder_item"))},{silent: true})

  responder_item_id:=>
    @.get("responder_item").get("id")

  getSubjectId:=>
    @.get('responder_item').get("subject_id")

  getResponderId:=>
    @.get('responder_item').get("respondent_id")

  createRootModel:=>
    params = _.extend({schema: @.get("schema")},@.get("form_content"),registrationModel:@)
    @.set("rootModel",new App.Models.PreRegistrationForm(params))
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
    











