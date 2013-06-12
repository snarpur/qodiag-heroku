@Qapp.module "ResponderItemsApp.Create", (Create, App, Backbone, Marionette, $, _) ->
  
  class Create.Controller extends App.Controllers.Base
    
    
    initialize:(options)->
      @entrySets = App.request "entry:sets:entities"
      

    create:->
      @showLayout()
      @showSelectItem()
      @showRespondents()
      @showItem()
    

    
    showItem:->
      view = new Create.ItemControl model: @getItem()
      @getLayout().itemControlRegion.show view
   
    

    showRespondents:->
      respondents = @getSubject().get('respondents')
      view = new Create.Respondents collection: respondents
      @getItem().set('respondents',respondents)
      @getLayout().respondentsRegion.show view

      @listenTo view, "respondent:selected", (id)=>
        @getItem().set("respondent_id", id)

    

    showSelectItem:->
      view = new Create.Items collection: @entrySets
      @getLayout().itemSelectRegion.show view

      @listenTo view, "entry:set:selected", (id)=>
        @getEntrySetResponse().set('entry_set_id', id)

    

    getItem:->
      @item ?= new App.Entities.ResponderItem
        caretaker_id: App.request("get:current:user").get('person_id')
        subject_id: @getSubject().id
        entry_set_response: @getEntrySetResponse()

    
    
    getEntrySetResponse:->
      @entrySetResponse ?= new App.Entities.EntrySetResponse()
    


    getSubject:->
      App.request "get:current:subject"

    

    showLayout:->
      App.dialogRegion.show @getLayout()
      @listenTo @getLayout(), "dialog:save", =>
        item = @getItem()
        item.save(item.toJSON())
        @listenTo item, 'created', =>
          @getLayout().trigger "dialog:close"
          toastr.success("Beiðni hefur verið send")
    
    

    getLayout:->
      @layout ?= new Create.Layout()
        


        



        
