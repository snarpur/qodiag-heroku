@Qapp.module "Components.Loading", (Loading, App, Backbone, Marionette, $, _) ->

  class Loading.LoadingView extends App.Views.ItemView
    template:false
    className: "loading-container"

    onShow: ->
      @$el.spinner()

    _getOptions: ->
      lines: 12            # The number of lines to draw
      length: 6            # The length of each line
      width: 2.5           # The line thickness
      radius: 7            # The radius of the inner circle
      corners: 1           # Corner roundness (0..1)
      rotate: 9            # The rotation offset
      direction: 1         # 1: clockwise, -1: counterclockwise
      color: '#000'        # rbg or #rrggbb
      speed: 1             # Rounds per second
      trail: 60            # Afterglow percentage
      shadow: false        # Whether to render a shadow
      hwaccel: true        # Wheter to use hardware acceleration
      className: 'spinner' # The CSS class to assign to the spinner 
      zIndex: 2e9          # The z-index (defaults to 200000000000)
      top: 'auto'          # Top position relative to parent in px
      left: 'auto'          # Left position relative to parent in px  
