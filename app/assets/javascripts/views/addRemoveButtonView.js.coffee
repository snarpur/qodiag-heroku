class App.Views.AddRemoveButton extends Backbone.View

  initialize:->
    @form = @options.form

  events:
    'click button.add-remove-btn':'addRemove'

  template:->
     JST['templates/siblingsControllsTmpl']

  addRemove:=>
    console.log "adding shit"

  render:->
    console.warn @form
    @form.$el.append($(@el).html(@template()({})))