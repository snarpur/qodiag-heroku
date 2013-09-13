@Qapp.module "Components.Loading", (Loading, App, Backbone, Marionette, $, _) ->

  class  Loading.LoadingController extends App.Controllers.Base

    initialize: (options) ->

      { view, config } = options

      config = if _.isBoolean(config) then {} else config

      _.defaults config,
        loadingType: "opacity-spinner"
        debug: false
        entities: @getEntities(view)

      #NOTE: Select the active region in the case we have a loader region 
      activeRegion = if options.loaderRegion then options.loaderRegion else @region

      switch config.loadingType
        when "opacity-spinner"
          $(activeRegion.el).toggleWrapper({spinner:true})
        when "opacity"
          $(activeRegion.el).css "opacity", 0.5
        when "spinner"  
          loadingView = @getLoadingView(config)
          @show loadingView
        else
          throw new Error("Invalid loadingType")

      @showRealView view, loadingView, config, activeRegion

    showRealView: (realView, loadingView, config, activeRegion) ->
      App.execute "when:fetched", config.entities, =>
          ## ...after the entities are fetched, execute this callback
          ## ================================================================ ##
          ## If the region we are trying to insert is not the loadingView then
          ## we know the user has navigated to a different page while the loading
          ## view was still open. In that case, we know to manually close the original
          ## view so its controller is also closed. We also prevent showing the real
          ## view (which would snap the user back to the old view unexpectedly)
          ## ================================================================ ##
        switch config.loadingType
          when "opacity-spinner"
            $(activeRegion.el).toggleWrapper({spinner:true},false)
          when "opacity"
            $(activeRegion.el).removeAttr "style"
          when "spinner"
            return realView.close() if activeRegion.currentView isnt loadingView
            
        if config?.callback then config.callback()
        @show realView

    getEntities: (view) ->
      ## return the entities manually set during configuration, or just pull
      ## off the the model and collection from the view (if they exists)
      _.chain(view).pick("model","collection").toArray().compact().value()

    getLoadingView: (config) ->
      new Loading.LoadingView
        model: config.entities

  App.commands.setHandler "show:loading", (view, options) -> 
    new Loading.LoadingController
      view: view
      region: options.region
      loaderRegion: options.loaderRegion
      config: options.loading