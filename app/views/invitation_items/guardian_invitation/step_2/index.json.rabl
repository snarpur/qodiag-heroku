object @responder_item 
attributes :id, :deadline, :registration_identifier, :caretaker_id
node do
  {:invite_respondent_user => false}
end
child :respondent => :respondent do
  attributes :id,:full_cpr,:invitation => true
end

node :subject do
  # partial("invitation_items/guardian_invitation/step_#{@step_no}/subject", :object => PersonDecorator.decorate(@responder_item.subject))
  partial("invitation_items/guardian_invitation/step_#{@step_no}/subject", :object => @responder_item.subject)
end