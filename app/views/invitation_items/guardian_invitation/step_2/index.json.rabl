object @responder_item
attributes :id, :deadline, :registration_identifier, :caretaker_id
node do
  {:invite_respondent_user => true}
end
child :respondent => :respondent do
  attributes :id
  child :user do
    attributes :id
  end
end

node do
  {
    :paramRoot => "responder_item",
    :urlRoot => "/invitation_items"
  }
end

node :subject do
  partial("invitation_items/guardian_invitation/step_#{@step_no}/subject", :object => PersonDecorator.decorate(@responder_item.subject))
end
