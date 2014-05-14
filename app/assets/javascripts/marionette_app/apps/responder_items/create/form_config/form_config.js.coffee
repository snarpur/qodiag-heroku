@Qapp.module "ResponderItemsApp.Create", (Create, App, Backbone, Marionette, $, _) ->

  Create.FormConfig = [
    {
      fieldType: "date"
      fieldName: "deadline"
      translationKey: "responder_item.deadline"
      validations: [
        {
          required: true,
          msg:-> 
            I18n.t("activerecord.errors.messages.blank")
        }
      ]
    },
    {
      fieldType: "select"
      fieldName: "respondent_id"
      optionText: "full_name"
      translationKey: "views.responder_items.select_respondents"
      validations: [
        {
          required: true,
          msg:-> 
            I18n.t("activerecord.errors.messages.blank")
        }
      ]
    },
    {
      fieldType: "select"
      modelName: "entry_set_response"
      fieldName: "entry_set_id"
      optionText: "name"
      translationKey: "responder_item.entry_set"
      validations: [
        {
          required: true,
          msg:-> 
            I18n.t("activerecord.errors.messages.blank")
        }
      ]
    }
    
  ]