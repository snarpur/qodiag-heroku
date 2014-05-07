@Qapp.module "EntrySetsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  EditCreate.FormConfig = [
    {
      fieldType: "text"
      fieldName: "name"
      translationKey: "terms.title"
      validations: [
        {
          required: true,
          msg:-> 
            I18n.t("activerecord.errors.messages.blank")
        }
      ]
    },
    {
      fieldType: "text_area"
      fieldName: "description"
      translationKey: "entry_set.description"
    },
  ]