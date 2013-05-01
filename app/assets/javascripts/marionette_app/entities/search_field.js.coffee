@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Search extends Entities.Model
    schema:
      search:{type: 'Text'}

  
  API =
    getSearchField: (search) ->
      field = new Entities.Search search: search
  
  App.reqres.addHandler "get:search:field", (options) ->
    console.warn options
    API.getSearchField options
  
