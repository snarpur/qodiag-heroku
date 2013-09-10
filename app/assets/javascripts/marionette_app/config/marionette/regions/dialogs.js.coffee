do (Backbone, Marionette) ->
  
  class Marionette.Region.Dialog extends Marionette.Region
    
    constructor: ->
      _.extend @, Backbone.Events
    
    onShow: (view) ->
      view.$el.modal({
        show: true
        keyboard: true
      })

      view.$el.find('input:text:visible:first').focus() if view.$el.find('input:text:visible:first')?

      view.$el.on "hidden", => @close()
      @setupBindings view 
    
    setupBindings: (view) ->
      @listenTo view, "dialog:close", @closeDialog

    
    closeDialog: ->
      @stopListening()
      @currentView.$el.modal('hide')

    
