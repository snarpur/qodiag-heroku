object @responder_item
attributes :id, :deadline, :registration_identifier, :caretaker_id
node do
  {:invite_respondent_user => true}
end

node :subject do
  partial("invitation_items/subject_invitation/step_#{@step_no}/subject", :object => PersonDecorator.decorate(@responder_item.subject))
end