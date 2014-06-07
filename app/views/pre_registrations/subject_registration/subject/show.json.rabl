node do
  partial("#{@responder_item.pre_registration_template}/step_#{@step_no}/show", :object => @responder_item)
end
