@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormPersonModel extends Entities.Person

    initialize:->
      @validation = {}
      @on "change:full_cpr", (model,value,options) ->
        if value.length is 10 
          data = App.request "get:national_register:data", value
          App.execute "when:fetched", data, ()=>
            if not data.isEmpty()             
              @mergeNationalRegisterData(data)
 
      super

    mergeNationalRegisterData:(data)->
      if @get("address")?
        @get("address").set(data.get("address"))

      @set(data.attributes)

    relations: [
      {
        type: Backbone.One
        key: 'address'
        relatedModel:->
          App.Entities.FormAddressModel
      },
      {
        type: Backbone.One
        key: 'user'
        relatedModel:->
          App.Entities.FormUserModel 
      },
      {
        type: Backbone.Many
        key: 'inverse_relationships'
        collectionType: "Qapp.Entities.Relationships"
        relatedModel:->
          App.Entities.Relationship
      }
    ]

  class Entities.FormPeopleCollection extends Entities.Collection
    model: Entities.FormPersonModel