App.Controllers.Forms ||= {}
class App.Controllers.Forms.Multistep extends Backbone.Router

  routes:
    "" : "index",
    "step/s:step_no" : "step" 
    "step/s:step_no/i:itemId" : "step" # e.g. /invitation_items/new#step/s2/i66P

  initialize:(options)->
    @formRenderer = new App.Models.FormRenderer(options)
    @formRenderer.on("change:step",@setStep)
    @invitationsView = new App.Views.FormRenderer({router: @, model: @formRenderer})
    $("#content").append(@invitationsView.render().el)


  index: ->
    @invitationsView.renderForm()
 
  step:(step_no,id)->
    @formRenderer.get('formMetaData').set('currentStep',step_no)
    @formRenderer.get('formModel').set("id",id)
    @formRenderer.fetch(@step_callbacks())

  setStep:(formRenderer)=>
    @navigate("step/s#{formRenderer.currentStepNo()}/i#{formRenderer.formModelId()}",{trigger: true,replace: true})


  step_callbacks: ->
    router = @ 
    callbacks=
      success:(model,response)->
        router.invitationsView.renderForm()
      error:(model,response)->
        throw "Error in App.Controllers.Forms.Multistep:step_callbacks()"
