class App.Models.CprLookup extends App.Models.Base


  initialize:=>

  url: =>
    @.urlRoot = "/national_register/"
    "#{Backbone.history.location.origin}#{@urlRoot}#{@get('cpr')}"
