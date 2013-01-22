object @form_object
attributes :form_template,:current_step_no,:current_step_name,:next_step_no,:last_step_no,:step_names,:root_object_id,:redirect_url_on_complete,:errors
attributes :current_step_form_content => :form_content,
           :current_step_form_schema => :schema

node do
  {:root_url => new_user_invitation_path(3)}
end

node do
  {:root_url => new_user_invitation_path(3)}
end