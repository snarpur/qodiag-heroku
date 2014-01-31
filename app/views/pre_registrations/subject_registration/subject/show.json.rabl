object @responder_item
node :formMetaData do 
  {
    :currentStep => @step_no,
    :stepLength => 1,
    :formTemplate => 'subject_invitation',
    :stepNames => ['patient_info']
 }
end



node :formModel do
  partial("#{@responder_item.pre_registration_template}/step_#{@step_no}/show", :object => @responder_item)
end

node :schema do
  partial("#{@responder_item.pre_registration_template}/step_#{@step_no}/schema", :object => @responder_item)
end