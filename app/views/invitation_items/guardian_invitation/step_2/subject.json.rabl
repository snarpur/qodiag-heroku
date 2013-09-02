object @subject
attributes :id, :full_cpr, :firstname, :lastname, :sex
  child :address do
    attributes :id, :street_1, :street_2, :town, :zip_code, :phone, :home_phone
    node(:paramRoot){"address"}
  end
node do
  {:object_class => "person"}
end
node do |subject|
  {
    :inverse_relationships => 
    [
      partial("invitation_items/guardian_invitation/step_#{@step_no}/inverse_relationships", :object => subject.find_or_build_inverse_parent_relationship_to(@responder_item.respondent,{:status => false})),
      partial("invitation_items/guardian_invitation/step_#{@step_no}/inverse_relationships", :object => subject.find_or_build_inverse_patient_relationship_to(@responder_item.caretaker)),
      partial("invitation_items/guardian_invitation/step_#{@step_no}/inverse_relationships", :object => subject.find_or_build_inverse_guardian_relationship_to(@responder_item.respondent)),   
      partial("invitation_items/guardian_invitation/step_#{@step_no}/inverse_relationships", :object => subject.find_or_build_inverse_respondent_relationship_to(@responder_item.respondent))  
    ]
  }
end
