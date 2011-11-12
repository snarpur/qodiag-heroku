$.fn.extend
  setCssState: (state) ->
    settings = 
      state: ''
      regexp: /state\-[a-z\-]*/g
      prefix: 'state-'
     
    if _.isObject(state) and state?
      state.regexp = new RegExp("#{state.prefix}\\-[a-z\-]*","g") 
      state.prefix = "#{state.prefix}-"
    else
      state = {state: state}
    
    settings = _.extend settings, state
    
    setState = () =>
      @.attr('class', updatedCssStr())
    
    updatedCssStr = () =>   
      css
      if hasState()
        css =cssString().replace(settings.regexp, newState())
      else
        css = "#{cssString()} #{newState()}"
      _.trim(css)
    
    cssString = () =>   
      @.attr('class') ? ""
    
    hasState = () =>
      _.include(cssString(),settings.prefix)
    
    newState = () =>  
     if _.isBlank(settings.state) then "" else "#{settings.prefix}#{settings.state}"
    
    @each () -> 
      setState settings