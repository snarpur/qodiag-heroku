@Qapp.module "ResponderItemsApp.Create", (Create, App, Backbone, Marionette, $, _) ->
  
  class Create.Controller extends App.Controllers.Base
    
    
    initialize:(options)->
      @collection = options.collection
      @entrySets = App.request "entry:sets:entities"
      

    create:->
      @showResponderItem()

   
    showResponderItem:->
      respJSON = @getSubject().get('respondents').toJSON(acceptsNested: false)
      respondents = (_.pick(r,'id','full_name') for r in respJSON)

      App.execute "when:fetched", @entrySets, =>
        entrySetsJSON = @entrySets.toJSON(acceptsNested: false)
        entrySets = (_.pick(e,'id','name') for e in entrySetsJSON)      

        view = new Create.ResponderItem model: @getItem(), respondents: respondents, entrySets: entrySets
        
        formView = App.request "form:wrapper", view, @buttonsConfig()
        App.dialogRegion.show formView

    getItem:->
      @item ?= new App.Entities.ResponderItem
        caretaker_id: App.request("get:current:user").get('person_id')
        subject_id: @getSubject().id

      @listenTo @item, "created", =>
        @collection.add @item

      @item

    getSubject:->
      App.request "get:current:subject"

    buttonsConfig:->
      options =
        modal: true
        title: I18n.t("views.responder_items.requests.submit")
        formClass: "form-horizontal"
      options

        


        



        
