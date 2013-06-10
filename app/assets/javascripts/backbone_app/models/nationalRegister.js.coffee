class App.Models.NationalRegisterEntry extends App.Models.Base

  urlRoot: "/national_register"
  initialize:->

    @url = ()->
      "#{@urlRoot}/#{@get('cpr')}"


class App.Collections.NationalRegister extends App.Collections.Base
  model: App.Models.NationalRegisterEntry
  url: "/national_register"  
