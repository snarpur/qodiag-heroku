module PersonBuildHelpers

  def setup_patient
    caretaker = FactoryGirl.create(:caretaker_user)
    respondent = FactoryGirl.create(:respondent_user)
    patient = FactoryGirl.create(:person)
    FactoryGirl.create(:patient_relationship, :person => caretaker.person, :relation => patient)
    FactoryGirl.create(:guardian_relationship, :person => respondent.person, :relation => patient)
    {:patient => patient, :caretaker => caretaker, :respondent => respondent}
  end

  def setup_responder_item
    setup = setup_patient
    responder_item = ResponderItem.new(:respondent_id => setup[:respondent].person.id,
                                       :caretaker_id => setup[:caretaker].person.id,
                                       :subject_id => setup[:patient].id
                                       )
  end


end
