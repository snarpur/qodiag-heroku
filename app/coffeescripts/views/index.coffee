App.Views.ResponderItems ||= {}

class App.Views.ResponderItems.Index extends Backbone.View

  template: ->
    return JST["index"]

  initialize: () ->
    _.bindAll(this, 'render');

  render: ->
    console.log "index VIEW"
    console.log this.options.responder_items.toJSON()
    $(this.el).html(this.template()(responder_items: this.options.responder_items.toJSON()))
    return this