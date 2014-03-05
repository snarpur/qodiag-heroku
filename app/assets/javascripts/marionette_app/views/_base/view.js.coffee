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
          backgroundColor: "rgba(255,0,0,0.7)"
          spinner: false
        
        wrapper.fadeOut 400, ->
          $(@).remove()
        
        @$el.fadeOut 400, =>
          _remove.apply @, args
      else
        _remove.apply @, args

    extendTemplateHelpers:(instanceHelpers)->
      instanceKeys = _.keys(instanceHelpers())
      baseKeys = _.keys(Marionette.View::templateHelpers())
      helpers = _.difference(baseKeys,instanceKeys)
      unless _.isEmpty(helpers)
        @templateHelpers = ()-> 
          _.extend(instanceHelpers(),_.pick(Marionette.View::templateHelpers(),helpers...))


    modelEvents: {}

    templateHelpers: ->
        
      routeTo:
        Routes
      
      t:(path)->
        I18n.t(path)

      l:(option, string)->
        I18n.l(option,string)

      m:(params = [])->
        if _.isEmpty(params)
          moment()
        else
          moment(params...)

      currentUser: ->
        App.request("get:current:user").toJSON({acceptsNested: false})
      
      hasRole:(role)->
        _.contains(@currentUser().role_names, role)

       
      getCSRFToken: ->
        token = $("meta[name=\"csrf-token\"]").attr("content")   


      linkTo: (name, url, options = {}) ->
        _.defaults options,
          external: false
        if options.external isnt true and _(url).startsWith("/")
          url = url.slice(1)
        url = "#" + url unless options.external
        
        className = options.className ? ''
        "<a href='#{url}' class='#{className}'>#{@escape(name)}</a>"





 