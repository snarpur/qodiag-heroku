@Qapp.module "SubjectEntriesApp.Show", (Show, App, Backbone, Marionette, $, _) ->

 
  class Show.Controller extends App.Controllers.Base


    show: (options) -> 
      {@region,@entryValue} = @options
      @entryValue = new App.Entities.EntryValue(@entryValue)
      @region.show @getLayout()
      @showEntryValue()
      @showComments()


    showEntryValue:->      
      entryView = new Show.Entry model: @entryValue
      @getEntryRegion().show entryView

    showComments:->
      commentsView = new Show.Comments(collection: @entryValue.get('comments'))
      @getCommentsRegion().show commentsView

      @listenTo commentsView, "new:comment:clicked", (view)=>

        App.execute "new:entry:comment", 
          region: @getNewCommentRegion()
          entry: @entryValue

        @listenTo @getNewCommentRegion(), "form:close", =>
          view.trigger("form:close")

    

    getEntryRegion:->
      @getLayout().entryRegion

    getCommentsRegion:->
      @getLayout().commentsRegion

    getNewCommentRegion:->
      @getLayout().newCommentRegion


    
    getLayout:()->
      @layout ?= new Show.Layout(model: @entryValue)