class App.Models.Person extends App.Models.Base

  defaults: 
    "object_class": "person"
    "i18n": "person"

  urlRoot: "/people"
  paramRoot: 'person'

  initialize:->
    super
    spouseRelationship = @.get("spouse_relationships")
    if spouseRelationship
      spouseRelationship.on("statusUpdate", @setAddres)

    @

  setAddres:(model)=>
    address = @get("address")
    console.info "START #{address.cid}",address
    unless model.changed.status?
      if model.get("status") is true then address.set("submitDisabled",model.get("status"))
      return

    if model.get('status') is true 
      address.disableFields()
      spouse_id = _.difference(_.filter(model.attributes,(v,k)-> k.search(/person|relation/) != -1), [@.get('id')])
      address.set("person_id",spouse_id,{silent: true})
      address.fetch(@commonAddressCallbacks())
    else
      address.set("person_id",@get('id'))
      address.fetch(@separateAddressCallbacks())



  commonAddressCallbacks:=>
    thisModel = @
    callbacks=
      formUpdate: true
      success:(model, response) ->
        model.disableFields()
        thisModel.set('address_id',model.get('id'))

      error:(model, xhr, options) ->
        throw "error in Person:commonAddressCallbacks"

  separateAddressCallbacks:=>
    thisModel = @
    callbacks=
      success:(model, response) ->
        if model.previous("id") == model.get("id")
          model.clearFormAttributes()

        thisModel.set('address_id',model.get('id'))
        model.enableFields()
      error:(model, xhr, options) ->
        throw "error in Person:separateAddressCallbacks"




class App.Collections.Person extends App.Collections.Base
  model: App.Models.Person
  paramRoot: "people"





App.Models.Aliases.Relations = App.Models.Person
App.Models.Aliases.InverseRelations = App.Models.Person
App.Models.Aliases.Relation = App.Models.Person
App.Models.Aliases.InverseRelation = App.Models.Person
