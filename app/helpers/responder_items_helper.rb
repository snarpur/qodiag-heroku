module ResponderItemsHelper
  def deadline_or_completed_header(items)
    header = items.first.completed == nil ? 'deadline' : 'submitted'
    I18n.t("terms.time_to_words.#{header}")

  end
  def deadline_or_completed_date(item)
    date = item.completed ? item.completed : item.deadline
    before_or_after_today(date)
  end
end
