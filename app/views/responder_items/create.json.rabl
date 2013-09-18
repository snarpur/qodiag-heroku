object @responder_item
attributes :id, :survey_id, :entry_set_response_id, :item_type, :deadline, :completed
node :entry_set_response ,:if => lambda { |item| item.is_entry_set_response? } do |s|
  partial("entry_set_responses/show.json.rabl", :object => s.entry_set_response)
end
