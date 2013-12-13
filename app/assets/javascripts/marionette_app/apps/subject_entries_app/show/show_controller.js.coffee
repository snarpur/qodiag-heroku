@Qapp.module "SubjectEntriesApp.Show", (Show, App, Backbone, Marionette, $, _) ->

 
  class Show.Controller extends App.Controllers.Base


    show: (options) -> 
      {@region,@entryField,@entries} = options
      @entryValue = @entryField.get('entry_values')
      # @entryField.set('entry_values',@entryValue)
      @region.show @getLayout()
      @showEntryValue()
      @showComments()

    

    showEntryValue:-> 
      entryView = new Show.Entries collection: @entryValue
      @getEntryRegion().show entryView

    

    showComments:->
      comments =  new App.Entities.EntryValues(@entryField.get('caretaker_entry_values'))
      @entryField.set('caretaker_entry_values',comments)
      commentsView = new Show.Comments(collection: comments)
      @getCommentsRegion().show commentsView

      @listenTo commentsView, "new:comment:clicked", (view)=>

        App.execute "new:entry:comment", 
          region: @getNewCommentRegion()
          entry: @entryField

        @listenTo @getNewCommentRegion(), "form:close", =>
          view.trigger("form:close")

    

    getEntryRegion:->
      @getLayout().entryRegion

    

    getCommentsRegion:->
      @getLayout().commentsRegion

    

    getNewCommentRegion:->
      @getLayout().newCommentRegion

    

    getRegionId:->
      _.first(@region.el.match(/view[0-9]*/))
    
    

    getLayout:()->
      @layout ?= new Show.Layout {regionId: @getRegionId()}