object @respondent
attributes :id, :full_cpr, :firstname, :lastname, :sex
  child :address do
    attributes :id, :street_1, :street_2, :town, :zip_code, :phone, :home_phone
    node(:paramRoot){"address"}
  end
node do
  {:object_class => 'person'}
end
node :user do |r|
  partial("invitation_items/guardian_invitation/step_#{@step_no}/user", :object => r.user_invitation)
end