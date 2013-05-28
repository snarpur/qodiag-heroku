$.fn.extend
  setCssState: (state,prefix) ->
    settings = 
      state: ''
      regexp: /^state\-[a-z\-]*/g
      prefix: 'state-'

    if prefix? and _.isString(prefix)
      regexp = "\^#{_.trim(prefix,"-")}\\-[a-z\-]*"
      settings.regexp = new RegExp(regexp,"g")
      settings.prefix = "#{prefix}-"

    settings.state = state
    setState = () =>
      @.attr('class', updatedCssStr())
    
    updatedCssStr = () =>   
      css
      if hasState()
        css = cssString().replace(hasState(), newState())
      else
        css = "#{cssString()} #{newState()}"

      _.trim(css)
    
    cssString = () =>   
      @.attr('class') ? ""
    
    isStateStr = (str) =>
      str.match(settings.regexp)
    
    hasState = () =>
      _.find(cssString().split(" "),(str)->
        _.isArray(str.match(settings.regexp))
      )
    
    newState = () =>  
     if _.isBlank(settings.state) then "" else "#{settings.prefix}#{settings.state}"
    
    @each () -> 
      setState settings
  
  cssState: (prefix) ->
    settings = 
      state: ''
      regexp: /^state\-[a-z\-]*/g
      prefix: 'state-'
    
    if prefix? and _.isString(prefix)
      regexp = "\^#{_.trim(prefix,"-")}\\-[a-z\-]*"
      settings.regexp = new RegExp(regexp,"g")
      settings.prefix = "#{prefix}-"
    
    css = @.attr('class').match(settings.regexp)
    css[0].split("-")[1] if css isnt null
