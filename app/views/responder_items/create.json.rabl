object @responder_item
attributes :id, :survey_id, :entry_set_response_id, :item_type, :deadline, :completed, :created_at
node :entry_set_response ,:if => lambda { |item| item.is_entry_set_response? } do |s|
  partial("entry_set_responses/show.json.rabl", :object => s.entry_set_response)
end
node :respondent ,:if => lambda { |item| item.is_respondent? } do |s|
  partial("people/patient/show", :object => s.respondent)
end
node :subject ,:if => lambda { |item| item.is_subject? } do |s|
  partial("people/patient/show", :object => s.subject)
end
