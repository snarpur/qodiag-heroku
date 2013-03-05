object false

node :formMetaData do 
  {
    :currentStep => @step_no,
    :stepLength => 2,
    :templateName => 'guardian_invitation'
 }
end

node :model do
  {:paramRoot => "responder_item", :attributes => partial("devise/invitations/guardian_invitation/step_#{@step_no}/index", :object => @responder_item)}
end

node :schema do
  partial("devise/invitations/guardian_invitation/step_#{@step_no}/schema", :object => @responder_item)
end