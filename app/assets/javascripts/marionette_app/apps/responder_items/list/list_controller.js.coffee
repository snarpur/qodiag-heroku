@Qapp.module "ResponderItemsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  List.Controller =
    
    
    items: ()->
      user = App.request "get:current:user"
      items = App.request "get:person:responder:items",{personId: user.get("person_id")}
      App.execute "when:fetched", items, =>
        
        itemsView = new List.Items {collection: items}
        App.contentRegion.show itemsView



     
        
