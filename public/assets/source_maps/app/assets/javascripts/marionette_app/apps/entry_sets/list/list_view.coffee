@Qapp.module "EntrySetsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "entry_sets/list/templates/list_layout"
    className:"row"

    regions:
      settingsNavigationRegion: "#settings-navigation-region"
      listRegion: "#list-region"

  class List.EntrySet extends App.Views.ItemView
    template: "entry_sets/list/templates/_entry_set"
    tagName: "tr"
    triggers:
      "click a.destroy" : 'delete:entry:set'
  
  class List.Empty extends App.Views.ItemView
    template: "entry_sets/list/templates/_empty"
    tagName: "tr"
  
  class List.EntrySets extends App.Views.CompositeView
    template: "entry_sets/list/templates/entry_sets"
    itemView: List.EntrySet
    emptyView: List.Empty
    itemViewContainer: "tbody"

    ui:
      wrapper: 'div#entry_sets_wrapper'
      table: "table#entry_sets"


    onShow:()->
      @ui.table.dataTable
        'sDom': "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>"
        'sPaginationType': "bootstrap"
        'language':
          'url': "assets/data-tables/locales/" + I18n.locale + ".json"
        'aoColumnDefs': [
          {
            'bSortable': true
            'aTargets': [0]
          },
          {
            'bSortable': false
            'sClass': 'thin'
            'aTargets': [1]
          }
      ]
      
      filter = @ui.wrapper.find(".dataTables_filter input")
      select = @ui.wrapper.find(".dataTables_length select")

      filter.addClass("form-control"); # modify table search input
      select.addClass("form-control"); # modify table per page dropdown

    triggers:
      'click button': 'new:entry:set'
