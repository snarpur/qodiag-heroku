@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  

  class Entities.NationalRegister extends Entities.Model
    urlRoot: () ->
      Routes.lookup_path(@get("kennitala"))

  class Entities.NationalRegisters extends Entities.Collection
    model: Entities.NationalRegister

  API =
    getNationalRegisterInformation:(full_cpr)->
      nr = new Entities.NationalRegister kennitala: full_cpr
      nr.fetch()
      nr

    getNationalRegisterFamily:(full_cpr)->
      nr = new Entities.NationalRegisters
      nr.url = Routes.family_path(full_cpr)
      nr.fetch()
      nr

  App.reqres.setHandler "get:national_register:data", (full_cpr) ->
    API.getNationalRegisterInformation(full_cpr)

  App.reqres.setHandler "get:national_register:family", (full_cpr) ->
    API.getNationalRegisterFamily(full_cpr)

 

