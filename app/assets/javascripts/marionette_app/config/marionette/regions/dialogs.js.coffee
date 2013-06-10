do (Backbone, Marionette) ->
  
  class Marionette.Region.Dialog extends Marionette.Region
    
    constructor: ->
      _.extend @, Backbone.Events
    
    onShow: (view) ->
      view.$el.modal('show')
      view.$el.on "hidden", => @close()
      @setupBindings view  
      
    
    setupBindings: (view) ->
      @listenTo view, "dialog:close", @closeDialog
  
    
    closeDialog: ->
      @stopListening()
      @currentView.$el.modal('hide')

    
