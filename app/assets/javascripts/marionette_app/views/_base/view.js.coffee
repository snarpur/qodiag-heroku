@Qapp.module "Views", (Views, App, Backbone, Marionette, $, _) ->
 
  _remove = Marionette.View::remove
  _.extend Marionette.View::,
  
    
    addOpacityWrapper: (init = true) ->
      @$el.toggleWrapper
        className: "opacity"
      , init
    
    setInstancePropertiesFor: (args...) ->
      for key, val of _.pick(@options, args...)
        @[key] = val
    
    remove: (args...) ->
      if @model?.isDestroyed?()
        wrapper = @$el.toggleWrapper
          className: "opacity"
          backgroundColor: "red"
        
        wrapper.fadeOut 400, ->
          $(@).remove()
        
        @$el.fadeOut 400, =>
          _remove.apply @, args
      else
        _remove.apply @, args

    templateHelpers: ->
        
      routeTo:
        Routes
      
      t:(path)->

      l:(option, string)->
        I18n.l(option,string)
      

      currentUser: ->
        App.request("get:current:user").toJSON()
      
      linkTo: (name, url, options = {}) ->
        _.defaults options,
          external: false
        if options.external isnt true and _(url).startsWith("/")
          url = url.slice(1)
        url = "#" + url unless options.external
        
        className = options.className ? ''
        "<a href='#{url}' class='#{className}'>#{@escape(name)}</a>"



 