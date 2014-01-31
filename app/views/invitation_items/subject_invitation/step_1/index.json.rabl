object @responder_item
attributes :id, :deadline, :registration_identifier, :caretaker_id
# node :user do
#   attributes :id
# end
node do
  {:invite_respondent_user => true}
end

node do
  {
    :paramRoot => "responder_item",
    :urlRoot => "/invitation_items/"
  }
end

node :subject do
  partial("invitation_items/subject_invitation/step_#{@step_no}/subject", :object => PersonDecorator.decorate(@responder_item.subject))
end