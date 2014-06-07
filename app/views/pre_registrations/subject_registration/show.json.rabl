object @responder_item
attributes :registration_identifier
node do
  partial("#{@responder_item.pre_registration_template}/show", :object => @responder_item)
end