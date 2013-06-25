class App.Views.AddRemoveButton extends Backbone.View

  initialize:->
    @form = @options.form

  events:
    'click button.add-remove-btn':'addRemove'

  template:->
     JST['backbone_app/templates/siblingsControllsTmpl']

  addRemove:=>


  render:->
    if (@template()?)
      @form.$el.append($(@el).html(@template()({})))
