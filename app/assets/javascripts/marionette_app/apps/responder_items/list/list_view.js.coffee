@Qapp.module "ResponderItemsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Layout extends App.Views.Layout
    template: "responder_items/list/templates/list_layout"
    regions:
      uncompleteItemsRegion: "#uncomplete-items-region"
      completeItemsRegion: "#complete-items-region"  
    

  class List.Item extends App.Views.ItemView
    template: "responder_items/list/templates/_item"
    tagName: 'tr'
    
  class List.NoRequests extends App.Views.ItemView
    template: "responder_items/list/templates/_empty"

    templateHelpers: =>
      tableTitle: =>
        I18n.t("responder_item.status.uncompleted")
    

  class List.Items extends App.Views.CompositeView
    template: "responder_items/list/templates/items"
    itemView: List.Item
    className:"col-lg-12"
    itemViewContainer: 'tbody'

    ui:
      wrapper: 'div.table_wrapper'
      table: "table.table"

    onShow:()->
      @ui.table.dataTable
        'sDom': "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>"
        'sPaginationType': "bootstrap"
        'language':
          'url': "assets/data-tables/locales/" + I18n.locale + ".json"

      
      filter = @ui.wrapper.find(".dataTables_filter input")
      select = @ui.wrapper.find(".dataTables_length select")

      filter.addClass("form-control"); # modify table search input
      select.addClass("form-control"); # modify table per page dropdown

    templateHelpers: =>
      tableTitle: =>
        I18n.t("responder_item.status.#{@options.status}")
      tableId: =>
        "#{@options.status}"


  # class List.Header extends App.Views.ItemView
  #   template: "responder_items/list/templates/header"
  #   className: "text-center"

