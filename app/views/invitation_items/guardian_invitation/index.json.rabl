object false

node :formMetaData do 
  {
    :currentStep => @step_no,
    :stepLength => 2,
    :formTemplate => 'guardian_invitation',
    :stepNames => ['guardian_info','patient_info']
 }
end

node :formModel do
  partial("invitation_items/guardian_invitation/step_#{@step_no}/index", :object => @responder_item)
end

node :schema do
  partial("invitation_items/guardian_invitation/step_#{@step_no}/schema", :object => @responder_item)
end