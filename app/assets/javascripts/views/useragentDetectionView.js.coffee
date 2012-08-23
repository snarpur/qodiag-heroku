class App.Views.useragentDetectionView extends Backbone.View
    className: "useragent-detection"
    
    initialize:()->
        @browser = @.options.browser
    
    template:->
        JST['templates/useragentDetectionTmpl']

    render:->
        $(@el).html(@template()(@browser))
        @ 