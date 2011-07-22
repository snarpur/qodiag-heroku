App.Views.ResponderItems ||= {}

class App.Views.ResponderItems.Index extends Backbone.View

  el : "#canvas"

  template: ->
    return JST["index"]

  initialize: () ->
    this.el = $(this.el)
    _.bindAll(this,'addOne','addAll','render')
    this.render()

  addOne: (item) ->
    $("#line-#{item.get('access_code')}",this.el).append(this.template()(item.toJSON()))

  addAll: ->
    @options.responder_items.each(this.addOne)

  render: ->
     @addAll()
     return this

