@Qapp.module "ResponderItemsApp.Create", (Create, App, Backbone, Marionette, $, _) ->
  
  class Create.Controller extends App.Controllers.Base
    
    
    initialize:(options)->
      @collection = options.collection
      @entrySets = App.request "entry:sets:entities"
      

    create:->
      @showResponderItem()

   
    showResponderItem:->
      @respondents = @getSubject().get('respondents')

      App.execute "when:fetched", @entrySets, =>
        @controllerModel = new App.Entities.Model()
        config = @getFormConfig()
        @rootModel = @getItem()
        @rootModel.get("entry_set_response").set("_entry_set_id_options",@entrySets)
        
        @listenTo @rootModel, "change:entry_set_response.entry_set_id",(model,value,options) => 
          if options.modelSelected?
            @rootModel.get("entry_set_response").set("name",options.modelSelected.get("name"))
        
        @fieldCollection = new App.Entities.FieldCollection(config,{rootModel:@rootModel,controllerModel:@controllerModel})
        
        @listenTo @rootModel, "created", (model) =>
          @collection.add model

        view = @getFieldsView(@fieldCollection)      

        formView = App.request "form:wrapper", view, @buttonsConfig()
        App.dialogRegion.show formView

        @rootModel.set("_respondent_id_options",@respondents)

    getFormConfig:()->
      Create.FormConfig

    getFieldsView: (collection) =>
      new App.Components.Form.FieldCollectionView 
        collection: collection
        model: @rootModel

    getItem:=>

      @item ?= new App.Entities.FormResponderItemModel
        caretaker_id: App.request("get:current:user").get('person_id')
        subject_id: @getSubject().id
        entry_set_response:
          entry_set_id: null

      @item

    getSubject:->
      App.request "get:current:subject"

    buttonsConfig:->
      options =
        errors: false
        modal: true
        title: I18n.t("views.responder_items.requests.submit")
        formClass: "form-horizontal"
      options