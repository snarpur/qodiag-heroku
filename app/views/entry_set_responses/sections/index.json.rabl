collection @entries
attributes :id, :title, :field_type, :help_text
glue @entry_set_response  do
  attributes :id => :entry_set_response_id
end

node :entry_values do |e|
  partial("entry_values/_entry_value",:object =>  e.entry_values.person(@entry_set_response.responder_item.respondent_id).by_response(@entry_set_response.id))
end


node :caretaker_entry_values, :if =>  @current_user.role?(:caretaker) do |e|
  partial("entry_values/_entry_value",:object => e.entry_values.person(@entry_set_response.responder_item.caretaker_id).by_response(@entry_set_response.id))
end
