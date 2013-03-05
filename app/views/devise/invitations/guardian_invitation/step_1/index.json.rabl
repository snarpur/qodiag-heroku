object @responder_item
attributes :id, :deadline, :registration_identifier, :caretaker_id
node :respondent do
  partial("devise/invitations/guardian_invitation/step_#{@step_no}/respondent", :object => PersonDecorator.decorate(@responder_item.respondent))
end
