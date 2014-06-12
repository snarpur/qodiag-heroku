@Qapp.module "ResponderItemsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  List.Controller =
  
    items: ()->
      @executeSettingsNavigation()
      App.contentRegion.show @getLayout()
      
      user = App.request "get:current:user"
      items = App.request "get:person:responder:items",{personId: user.get('person_id')}

      App.execute "when:fetched", items, =>

        completed = items.select((item) ->
          item.get('completed')?)

        uncompleted = items.filter((item) ->
          not item.get('completed')?)
      
        unless completed.length == 0
          itemsCompletedView = new List.Items {collection: new App.Entities.ResponderItems(completed,{}), status: "completed"}
          @getLayout().completeItemsRegion.show itemsCompletedView

        
        if uncompleted.length == 0
          noitemsUncompletedView = new List.NoRequests {model: uncompleted}
          @getLayout().uncompleteItemsRegion.show noitemsUncompletedView
        else
          itemsUncompletedView = new List.Items {collection: new App.Entities.ResponderItems(uncompleted,{}), status: "uncompleted"}
          @getLayout().uncompleteItemsRegion.show itemsUncompletedView

    executeSettingsNavigation:() ->
      App.execute "show:settings:navigation", 
        iconClass: "fa fa-envelope"
        i18n: "views.responder_items.requests.name"

    getLayout:=>
      @layout ?= new List.Layout

        
