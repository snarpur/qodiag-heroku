class App.Models.PreRegistration extends Backbone.Model

  initialize:=>
    @.set({responder_item: new App.Models.ResponderItem(@.get("responder_item"))})
    @.urlRoot = "/pre_registrations/:responder_item_id/edit/step/"
    @.url = ()->
      base = @.urlRoot.replace(/:responder_item_id/, @responder_item_id())
      "#{base}#{'' if _.endsWith(base,'/')}#{encodeURIComponent(@.get('current_step_no'))}"

  
  responder_item_id:=>
    @.get("responder_item").get("id")










