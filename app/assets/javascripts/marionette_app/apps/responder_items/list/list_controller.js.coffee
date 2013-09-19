@Qapp.module "ResponderItemsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  List.Controller =
    
    
    items: ()->
      App.contentRegion.show @getLayout()

      @getLayout().headerRegion.show new List.Header(model: new Backbone.Model())
      
      user = App.request "get:current:user"
      items = App.request "get:person:responder:items",{personId: user.get('person_id')}

      App.execute "when:fetched", items, =>

        completed = items.select((item) ->
          item.get('completed')?)

        uncompleted = items.filter((item) ->
          not item.get('completed')?)

        itemsCompletedView = new List.Items {collection: new App.Entities.ResponderItems(completed,{}), status: "completed"}
        @getLayout().completeItemsRegion.show itemsCompletedView

        itemsUncompletedView = new List.Items {collection: new App.Entities.ResponderItems(uncompleted,{}), status: "uncompleted"}
        @getLayout().uncompleteItemsRegion.show itemsUncompletedView
        

    getLayout:=>
      @layout ?= new List.Layout

        
