@Qapp.module "Views", (Views, App, Backbone, Marionette, $, _) ->
 

  _.extend Marionette.View::,
  
    templateHelpers: ->
      
      routeTo:
        Routes
      
      currentUser: ->
        App.request("get:current:user").toJSON()
      
      linkTo: (name, url, options = {}) ->
        _.defaults options,
          external: false
        
        url = "#" + url unless options.external
        className = options.className ? ''
        "<a href='#{url}' class='#{className}'>#{@escape(name)}</a>"

