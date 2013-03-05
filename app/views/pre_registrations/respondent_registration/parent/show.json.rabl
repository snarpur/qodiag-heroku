object @responder_item
node :formMetaData do 
  {
    :currentStep => @step_no,
    :formTemplate => 'pre_registration_as_guardian_and_parent',
    :stepNames => ['subject','contact_info','subject_parent']
  }
end

node :formModel do |responder_item|
  partial("#{@responder_item.pre_registration_template}/step_#{@step_no}/show", :object => responder_item)
end
node :schema do
  partial("#{@responder_item.pre_registration_template}/step_#{@step_no}/schema", :object => @responder_item)
end