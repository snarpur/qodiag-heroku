@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Search extends Entities.Model
    schema:
      search:{type: 'Text'}

  
  API =
    getSearchField: (search) ->
      field = new Entities.Search search: search
  
  App.reqres.setHandler "get:search:field", (options) ->
    API.getSearchField options
  
