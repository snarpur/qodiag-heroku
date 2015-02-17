@Qapp.module "Components.Loading", (Loading, App, Backbone, Marionette, $, _) ->

  class Loading.LoadingView extends App.Views.ItemView
    template: "loading/loading"
    className: "loading-container center-block"

   
