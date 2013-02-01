App.Controllers.Forms ||= {}
class App.Controllers.Forms.Multistep extends Backbone.Router

  routes:
    "" : "index",
    "step/s:step_no" : "step" 
    "step/s:step_no/i:itemId" : "step"

  initialize:(options)->
    @form = options
    @root_url = options.root_url

  index: ->
    invitationsView = new App.Views.FormRenderer({router: @, model_attributes: @form})
    $("#content").append(invitationsView.render().el)
 
  step:(step_no,root_object_id)->
    console.log(arguments)
    formRenderer = new App.Models.FormRenderer({root_url: @root_url, current_step_no: step_no, root_object_id: root_object_id})
    formRenderer.fetch(@step_callbacks())

  step_callbacks: ->
    console.log('callbacks')
    router = @ 
    callbacks=
      success:(model,response)->
        $("#content").empty()
        invitationsView = new App.Views.FormRenderer({router: router, model: model})
        $("#content").append(invitationsView.render().el)
      error:(model,response)->
        console.warn "Error"
