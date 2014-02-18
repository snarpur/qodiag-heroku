object false

node :formMetaData do 
  {
    :currentStep => 1,
    :stepLength => 1,
    :formTemplate => 'subject_invitation',
    :stepNames => ['patient_info']
 }
end

node :errors do
  unless @responder_item.errors.empty?
    @responder_item.errors.messages
  end
end

node :formModel do
  partial("invitation_items/subject_invitation/step_#{@step_no}/index", :object => @responder_item)
end

node :schema do
  partial("invitation_items/subject_invitation/step_#{@step_no}/schema", :object => @responder_item)
end