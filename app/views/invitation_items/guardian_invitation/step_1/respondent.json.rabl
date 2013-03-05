object @respondent
attributes :id, :full_cpr, :firstname, :lastname, :sex
node do 
  {:object_class => 'person'}
end
node :user do |r|
  partial("invitation_items/guardian_invitation/step_#{@step_no}/user", :object => r.user_invitation)
end