App.Controllers.Invitations ||= {}

class App.Controllers.Invitations.Guardian extends Backbone.Router

  initialize:(options)->
    @form = options

  routes:
    "" : "index"

  index: ->
    invitationsView = new App.Views.FormRenderer({model_attributes: @form})
    $("#content").append(invitationsView.render().el)