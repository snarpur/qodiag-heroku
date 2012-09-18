$(document).ready(()->
  Backbone.Form.validators.errMessages.required = I18n.t("activerecord.errors.messages.empty")
  Backbone.Form.validators.errMessages.match = 'This value must match the value of {{field}}'
  Backbone.Form.validators.errMessages.email = '{{value}} is an invalid email address.'
  )
