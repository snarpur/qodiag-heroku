@Qapp.module "Components.Dialog", (Dialog, App, Backbone, Marionette, $, _) ->
  
  class Dialog.Controller extends App.Controllers.Base
    
    initialize: (options = {}) ->
      @contentView = options.view
      @getLayout().on "show", ()=>
        @showDialog()
        @showContent(options.view)
      
    #   @listenTo @formLayout, "show", @formContentRegion
    #   @listenTo @formLayout, "form:submit", @formSubmit
    #   @listenTo @formLayout, "form:cancel", @formCancel

    
    
    # formCancel: ->
    #   @contentView.triggerMethod "form:cancel"
    
    

    # formSubmit: (options) ->
    #   @contentView.triggerMethod("form:submit")
    #   model = @contentView.model
    #   collection = @contentView.collection
    #   model.isValid()
    #   @formLayout.addErrors(model.validationError)
    #   @processDialogSubmit model, collection
    
    

    # processDialogSubmit: (model, collection) ->
    #   model.save model.toJSON(),
    #     collection: collection
    
    

    # onClose: ->
      
    
    
    # formContentRegion: ->
    #   @region = @formLayout.formContentRegion
    #   @show @contentView
    
    getContentRegion:->
      @getLayout().dialogContentRegion

    
    getDialogRegion:->
      App.dialogRegion

    
    showContent:(view)->
      @getContentRegion().show view

    showDialog:()->
      @getLayout().$el.modal('show')   

    
    showLayout: (options = {})->
      @getDialogRegion().show @getLayout()
    

    getLayout: (options = {}) ->
      @layout ?= new Dialog.DialogWrapper options
    




    # getDefaultConfig: (config = {}) ->
    #   _.defaults config,
    #     footer: true
    #     focusFirstInput: true
    #     errors: true
    #     syncing: true
    
    

    # getButtons: (buttons = {}) ->
    #   App.request("form:button:entities", buttons, @contentView.model) unless buttons is false
  
  
  # App.dialogRegion.on "show", ()->
    
  #   dialogController = new Dialog.Controller {}
  #   dialogController.getDialogContentRegion()
  #   console.log dialogController.getDialogRegion()
  #   console.log "listening to dialog", arguments


  App.reqres.setHandler "show:dialog", (view,options = {}) ->
    dialog = new Dialog.Controller _.extend {view: view}, options
    dialog.showLayout() 
    # dialog.getDialogContentRegion()

