collection @entries
attributes :display_order

node do |e| 
  partial("entry_fields/show",:object => e.entry_field)
end

glue @entry_set_response  do
  attributes :id => :entry_set_response_id
end

node :entry_values, :if =>  @current_user.role?(:respondent) do |e|
  partial("entry_values/_entry_value",
          :object =>  e.entry_field.response_values_for_person(@entry_set_response.responder_item.respondent,@entry_set_response))
end



node :entry_values, :if =>  @current_user.role?(:caretaker) do |e|
  partial("entry_values/_entry_value",
          :object =>  e.entry_field.response_values_for_person(@entry_set_response.responder_item.respondent,@entry_set_response))
end


node :caretaker_entry_values, :if =>  @current_user.role?(:caretaker) do |e|
  partial("entry_values/_entry_value",
          :object => e.entry_field.response_values_for_person(@entry_set_response.responder_item.caretaker,@entry_set_response))
end
