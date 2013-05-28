collection @entries
attributes :id, :title, :field_type, :help_text
node do
  {:entry_set_response_id => @entry_set_response_id}
end
node :entry_values do |e|
  [
    partial("entry_values/_entry_value",:object => e.get_or_initialize_entry_value(@entry_set_response_id))
  ]
end
node :caretaker_entry_values do |e|
  partial("entry_values/_entry_value",:object => e.entry_values.caretaker(@current_user.person_id,@entry_set_response_id))
end
