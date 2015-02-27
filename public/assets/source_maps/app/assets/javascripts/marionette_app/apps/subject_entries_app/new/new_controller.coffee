@Qapp.module "SubjectEntriesApp.New", (New, App, Backbone, Marionette, $, _) ->

 
  class New.Controller extends App.Controllers.Base

    initialize:(options)->
      {@region,@entry} = options

    

    newEntry:->
      formView = @showForm()
      @listenTo formView, "form:cancel",=>
        @region.trigger("form:close")
        @region.close()


    
    showForm:->
      editView = @getFormView()
      formView = App.request "form:wrapper", editView, {collection: editView.collection}
      @region.show formView
      formView


    
    createModel:->
      attributes =
        entry_field_id: @entry.get('id')
        entry_set_response_id:  @entry.get('entry_set_response_id')
        person_id: App.request("get:current:user").get('person_id')
        text_value: ""
      
      entry = new App.Entities.EntryValue attributes
      
      @listenTo entry,"sync:stop",(model) ->
        @region.close()
        @region.trigger("form:close")
      entry

    

    getFormView:->
      new New.Entry 
        model: @createModel() 
        collection: @entry.get('caretaker_entry_values')
