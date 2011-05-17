module TranslationHelper

  def before_or_after_today(date)
    period = time_ago_in_words(date)
    time_prefix = date < Date.today ? I18n.t("time_to_words.ago") : I18n.t("time_to_words.until")
    str = "#{period} #{time_prefix}"
  end
end