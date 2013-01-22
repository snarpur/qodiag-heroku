class App.Models.FormRenderer extends Backbone.Model

  initialize:=>
    @.destructionQueue = new Backbone.Collection
    @.url = ()->
      "#{@.get('root_url')}#{@step_url()}#{@root_object_url()}"

  step_url:->
    if @.get('current_step_no') then "/step/#{@.get('current_step_no')}" else ""

  is_last_step:->
    @.get("current_step_no") == @.get('last_step_no')

  root_object_url:->
    if @.get('root_object_id') then "/#{@.get('root_object_id')}" else ""

  createRootModel:=>
    params = _.extend({schema: @.get("schema")},@.get("form_content"),formRenderModel:@)
    @.set("rootModel",new App.Models.FormRootObject(params))
    @.get('rootModel')

  getRootModel:=>
    @.get('rootModel')

  getFormRootObjectlId:->
    @get('rootModel').getFormRootObject().get('id')

  getFormTemplate:->
    @.get('form_template')

  getStepName:->
    @.get('current_step_name')
  
  getCurrentStepNo:->
    @.get('current_step_no')
    
  i18nStepName:(step_name)->
    I18n.translate("forms.#{@getFormTemplate()}.steps.#{step_name}")

  redirectUrl:->
      path = new RegExp("#{window.location.pathname}#{window.location.hash}")
      redirectPath = "#{window.location.href}".replace(path,@get('redirect_url_on_complete'))
  
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
    











