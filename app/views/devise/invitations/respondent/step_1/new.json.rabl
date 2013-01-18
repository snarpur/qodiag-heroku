object @form_object
node :form_content do |u|
  {:responder_item => partial("devise/invitations/respondent/step_1/responder_item.json.rabl", :object => @responder_item)}
end



glue @schema do
  attributes :current_step_no,:current_step_name
  attributes :step_names => :steps, :current_step_form_schema => :schema
end

node do
  {:root_url => user_invitation_path}
end
