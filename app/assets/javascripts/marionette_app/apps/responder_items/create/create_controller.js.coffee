@Qapp.module "ResponderItemsApp.Create", (Create, App, Backbone, Marionette, $, _) ->
  
  class Create.Controller extends App.Controllers.Base
    
    
    initialize:(options)->
      @collection = options.collection
      @entrySets = App.request "entry:sets:entities"
      

    create:->
      @showLayout()
      @showSelectItem()
      @showRespondents()
      @showItem()
      @getLayout()
    

    
    showItem:->
      view = new Create.ItemControl model: @getItem()
      @getLayout().itemControlRegion.show view
      view
   
    

    showRespondents:->
      respondents = @getSubject().get('respondents')
      view = new Create.Respondents collection: respondents, model: @getItem()
      @getItem().set('respondents',respondents)
      @getLayout().respondentsRegion.show view

      @listenTo view, "respondent:selected", (view,options)=>
        @getItem().set("respondent_id",  view?.model?.id)

    

    showSelectItem:->
      view = new Create.Items collection: @entrySets, model: @getItem()
      @getLayout().itemSelectRegion.show view

      @listenTo view, "item:selected", (view,options)=>
        entrySetResponse = 
          entry_set_id: view?.model?.id
          name: view?.model?.get('name')
        @getItem().get('entry_set_response').set(entrySetResponse)
        
    

    getItem:->
      @item ?= new App.Entities.ResponderItem
        caretaker_id: App.request("get:current:user").get('person_id')
        subject_id: @getSubject().id



    getSubject:->
      App.request "get:current:subject"

    

    showLayout:->
      App.dialogRegion.show @getLayout()
      @listenTo @getLayout(), "dialog:save", =>
        item = @getItem()
        errors = item.validate()
        unless errors
          @getLayout().addOpacityWrapper()
          item.save(item.attributes)
          @listenTo item, 'created', =>
            @collection.add item
            @getLayout().trigger "dialog:close"
            toastr.success("Beiðni hefur verið send")
    
    

    getLayout:->
      @layout ?= new Create.Layout()
        


        



        
