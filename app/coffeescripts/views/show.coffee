App.Views.ResponderItems ||= {}

class App.Views.ResponderItems.View extends Backbone.View

  events:
    ".line .item a" : 'show'

  template: ->
    return JST["show"]

  show : ->
    alert "hey"

  render: ->
    $(this.el).html(this.template()(this.options.model.toJSON() ))
    return this