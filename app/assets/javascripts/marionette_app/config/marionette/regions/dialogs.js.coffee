do (Backbone, Marionette) ->
  
  class Marionette.Region.Dialog extends Marionette.Region
    
    constructor: ->
      _.extend @, Backbone.Events
    
    onShow: (view) ->
      view.$el.modal({
        show: true
        keyboard: true
      })

      @listenTo view.model, "created updated", ()=>
        @closeDialog

      view.$el.on "hidden", => @close()
      @setupBindings view 
    
    setupBindings: (view) ->
      @listenTo view, "dialog:close", @closeDialog
    
    closeDialog: ->
      @stopListening()
      # When valdate against the server closeDialog is called and the next time currentView doesn't exists
      if @currentView?
        @currentView.$el.modal('hide')

    
