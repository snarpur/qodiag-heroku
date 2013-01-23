 class App.Controllers.PreRegistrationsController extends Backbone.Router

  initialize:(options)->
    @form = options 


  routes:
    "" : "index"

  index: ->
    # preRegistrationView = new App.Views.PreRegistration({model_attributes: @form})
    preRegistrationView = new App.Views.FormRenderer({router: @, model_attributes: @form})
    $("#content").append(preRegistrationView.render().el)