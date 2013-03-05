object @respondent
attributes :id, :full_cpr, :firstname, :lastname, :sex
node :user do |r|
  partial("devise/invitations/guardian_invitation/step_#{@step_no}/user", :object => r.user_invitation)
end