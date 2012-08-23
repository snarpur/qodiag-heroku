class App.Controllers.PreRegistrationsController extends Backbone.Router

  initialize:(options)->
    @status = options 


  routes:
    "" : "index"

  index: ->
    # preRegistrationModel = new App.Models.PreRegistration(@status)
    preRegistrationView = new App.Views.PreRegistration({model_attributes: @status})
    $("#content").append(preRegistrationView.render().el)