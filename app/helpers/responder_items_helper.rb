module ResponderItemsHelper
  def deadline_or_completed_header(items)
    header = items.first.completed == nil ? 'deadline' : 'submitted'
    I18n.t("terms.time_to_words.#{header}")

  end
  def deadline_or_completed_date(item)
    date = item.completed ? item.completed : item.deadline
    before_or_after_today(date)
  end
  def user_partial_path(path)
    partial = @current_user.roles.first.name
    "responder_items/#{partial}/#{path}"
  end

  def responder_item_partial_for(person,responder_items,path=nil)
      path = path.nil? ? "/" : "/#{path}/"
      render :partial => "responder_items/#{person.role}#{path}items", :collection => responder_items, :as => :item
  end

  def responder_item_index_partial
    partial = @current_user.roles.first.name
    if @person.nil?
      "responder_items/#{partial}/index"
    else
      "responder_items/#{partial}/patient_index"
    end
  end
end
