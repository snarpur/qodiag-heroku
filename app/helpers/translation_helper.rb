module TranslationHelper

  def before_or_after_today(date,attribute)
    period = time_ago_in_words(date)
    time_prefix = date < Date.today ? I18n.t("time_to_words.ago") : I18n.t("time_to_words.until")
    time_verb = date < Date.today ? I18n.t("time_to_words.expired") : I18n.t("time_to_words.expires")
    attribute_string = "activerecord.attributes.responder_item.#{attribute}"
    str = "#{period} #{time_prefix} #{I18n.t(attribute_string)}  #{time_verb}"
  end
end