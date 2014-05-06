$(document).ready(()->
  Backbone.Form.validators.errMessages.required = I18n.t("activerecord.errors.messages.empty")
  Backbone.Form.validators.errMessages.email =  I18n.t("activerecord.errors.messages.invalid")
  Backbone.Form.validators.errMessages.match = I18n.t("activerecord.errors.messages.not_equal", field:"{{field}}")
  Backbone.Form.editors.Date.monthNames = I18n.translations.is.date.month_names[1..]

  )


