object @responder_item
attributes :id, :deadline, :registration_identifier, :caretaker_id
node do
  {:object_class => 'responder_item'}
end

node do
  {
    :paramRoot => "responder_item",
    :urlRoot => "/invitation_items"
  }
end

node :respondent do
  partial("invitation_items/guardian_invitation/step_#{@step_no}/respondent", :object => PersonDecorator.decorate(@responder_item.respondent))
end