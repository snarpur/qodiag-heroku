$.fn.extend
  helpOverlay: () ->
    settings = 
      trigger: 'a'
      overlay: "#help-overlay"
     
    
    setUp = () =>
      $(@,settings.trigger).bind("click", (e)->
        e.preventDefault()
         this
        $(settings.overlay).toggleClass("visible")
      )
        
    @each () -> 
      setUp settings
    


