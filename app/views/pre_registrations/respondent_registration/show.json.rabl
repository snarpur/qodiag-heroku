object @responder_item
attributes :registration_identifier
node(:subtype) {@responder_item.respondent_registration_partial}
node do
  partial("#{@responder_item.pre_registration_template}/show", :object => @responder_item)
end