collection @entries
attributes :id, :title, :field_type, :help_text
glue @entry_set_response  do
  attributes :id => :entry_set_response_id
end

node :entry_values, :if =>  @current_user.role?(:respondent) do |e|
  partial("entry_values/_entry_value",
          :object =>  e.response_values_for_person(@entry_set_response.responder_item.respondent,@entry_set_response).first_or_initialize)
end



node :entry_values, :if =>  @current_user.role?(:caretaker) do |e|
  partial("entry_values/_entry_value",
          :object =>  e.response_values_for_person(@entry_set_response.responder_item.respondent,@entry_set_response))
end


node :caretaker_entry_values, :if =>  @current_user.role?(:caretaker) do |e|
  partial("entry_values/_entry_value",
          :object => e.response_values_for_person(@entry_set_response.responder_item.caretaker,@entry_set_response))
end
