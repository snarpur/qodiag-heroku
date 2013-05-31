collection @responder_items
attributes :id, :survey_id, :entry_set_response_id, :item_type, :deadline, :completed, :subject_full_name, :respondent_full_name

node :entry_set_response ,:unless => lambda { |item| item.is_survey? } do |s|
  partial("entry_set_responses/show.json.rabl", :object => s.entry_set_response)
end

node :response_set_access_code ,:if => lambda { |item| item.is_survey? } do |s|
  s.response_set_access_code
end

node :survey, :if => lambda { |s| s.is_survey? } do |s|
  partial("surveyor/show.json.rabl", :object => s.survey)
end