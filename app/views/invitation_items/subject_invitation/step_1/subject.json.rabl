object @subject
attributes :id, :full_cpr, :firstname, :lastname, :sex
  child :address do
    attributes :id, :street_1, :street_2, :town, :zip_code, :phone, :home_phone
    node(:paramRoot){"address"}
  end
  node :user do |r|
  partial("invitation_items/subject_invitation/step_#{@step_no}/user", :object => r.user_invitation)
end
node do |subject|
  {
    :inverse_relationships => 
    [    
      partial("invitation_items/subject_invitation/step_#{@step_no}/inverse_relationships", :object => subject.find_or_build_inverse_patient_relationship_to(@responder_item.caretaker))
    ]
  }
end