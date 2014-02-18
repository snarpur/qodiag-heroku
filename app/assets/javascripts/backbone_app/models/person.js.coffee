class App.Models.Person extends App.Models.Base

  defaults: 
    "object_class": "person"
    "i18n": "person"

  urlRoot: "/people"
  paramRoot: 'person'

  blacklist: ["family"]

  initialize:->
    super
    spouseRelationship = @.get("spouse_relationships")
    if spouseRelationship
      spouseRelationship.on("statusUpdate", @setAddres)

    @on('change:family', (model, attribute)=>
      App.Event.trigger('person:cpr:populate_from_select', attribute)
    )

    @on('change:full_cpr', @getCprFields)
    @on('change:form', ()=>
      family = @get('family')
      if family
        options = _.map(family,((v)->
          { val: _.keys(v)[0], label: _.values(v)[0] }
        ),@)

        @get('form').fields.family.editor.setOptions(options)

      if _.has(@attributes, 'full_cpr')
        App.Event.on('person:cpr:populate_from_select', (attribute)=>
          @set('full_cpr', attribute, {formUpdate: true})
        )
    )

    @

  setAddres:(model)=>
    address = @get("address")
    unless model.changed.status?
      if model.get("status") is true then address.set("submitDisabled",model.get("status"))
      return

    if model.get('status') is true 
      spouse_id = _.difference(_.filter(model.attributes,(v,k)-> k.search(/person|relation/) != -1), [@.get('id')])
      address.set("person_id",spouse_id,{silent: true})
      address.fetch(@commonAddressCallbacks())
    else
      if @get('id')
        address.set("person_id",@get('id'))
        address.fetch(@separateAddressCallbacks())
      else
        address.clearFormAttributes()
        address.enableFields()
  
  getCprFields:(person)=>
    thisModel = @
    address = thisModel.get("address");
    cpr =  person.get('full_cpr')
    if cpr.length == 10
      entry = new App.Models.NationalRegisterEntry({cpr:cpr})
      entry.fetch
        success:(model, response) ->
          thisModel.set(response, {formUpdate: true})
          if _.isFunction(address.set)
            address.set(response, {formUpdate: true})
        error:(model, xhr, options) ->
          throw I18n.t("marionette.errors.error_in_function", function: "Person:getCprFields")

  
  commonAddressCallbacks:=>
    thisModel = @
    callbacks=
      formUpdate: true
      success:(model, response) ->
        model.disableFields()
        thisModel.set('address_id',model.get('id'))
      error:(model, xhr, options) ->
        throw I18n.t("marionette.errors.error_in_function", function: "Person:commonAddressCallbacks")

  separateAddressCallbacks:=>
    thisModel = @
    callbacks=
      success:(model, response) ->
        if model.previous("id") == model.get("id")
          model.clearFormAttributes()
        thisModel.set('address_id',model.get('id'))
        model.enableFields()
      error:(model, xhr, options) ->
        throw I18n.t("marionette.errors.error_in_function", function: "Person:separateAddressCallbacks")




class App.Collections.Person extends App.Collections.Base
  model: App.Models.Person
  paramRoot: "people"





App.Models.Aliases.Relations = App.Models.Person
App.Models.Aliases.InverseRelations = App.Models.Person
App.Models.Aliases.Relation = App.Models.Person
App.Models.Aliases.InverseRelation = App.Models.Person
