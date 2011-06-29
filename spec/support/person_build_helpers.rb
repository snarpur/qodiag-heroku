module PersonBuildHelpers

  def setup_patient
    caretaker = Factory(:user, :roles => [Factory(:role, :name => 'caretaker')])
    client = Factory(:user, :roles => [Factory(:role, :name => 'client')])
    patient = Factory(:person)
    Factory(:patient_relationship, :person => caretaker.person, :relation => patient)
    Factory(:guardian_relationship, :person => client.person, :relation => patient)
    {:patient => patient, :caretaker => caretaker, :client => client}
  end

  def setup_responder_item
    setup = setup_patient
    responder_item = ResponderItem.new(:client_id => setup[:client].person.id,
                                       :caretaker_id => setup[:caretaker].person.id,
                                       :subject_id => setup[:patient].id
                                       )
  end


end
