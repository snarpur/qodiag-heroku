(function() {
  this.Qapp.module("EntrySetsApp.EditCreate", function(EditCreate, App, Backbone, Marionette, $, _) {
    return EditCreate.FormConfig = [
      {
        fieldType: "text",
        fieldName: "name",
        fieldLabel: {
          i18n: "terms.title"
        },
        validations: [
          {
            required: true,
            msg: function() {
              return I18n.t("activerecord.errors.messages.blank");
            }
          }
        ]
      }, {
        fieldType: "text_area",
        fieldName: "description",
        fieldLabel: {
          i18n: "entry_set.description"
        }
      }
    ];
  });

}).call(this);
