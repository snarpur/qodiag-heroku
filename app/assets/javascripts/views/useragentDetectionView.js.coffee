class App.Views.useragentDetectionView extends Backbone.View
    className: "useragent-detection"
    
    initialize:()->
        @browser = @.options.browser
    
    template:->
        JST['templates/useragentDetectionTmpl']

    render:->
        console.log @browser
        $(@el).html(@template()(@browser))
        @ 