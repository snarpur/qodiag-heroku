object @form_preprocessor
attributes :current_step_no,:current_step_name
attributes :current_step_form_content => :form_content,
           :current_step_form_schema => :schema,
           :step_names => :steps
node do
  {:root_url => user_invitation_path, :me => "gulli"}
end
