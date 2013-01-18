object @responder_item
attributes :id,:name, :caretaker_id, :registration_identifier
node do |r|
   {:respondent => partial("devise/invitations/respondent/step_1/respondent.json.rabl", :object => r.respondent)}
end
