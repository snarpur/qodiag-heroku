require 'faker'
class ResponderItemPopulateUtil

  def initialize

  end
  
  def create_responder_item(survey_id ,people,created_at,entry_set_response_id=nil)
    responder_item = FactoryGirl.create( :item_with_people, 
                    :respondent_id => people[:parent][:person].id, 
                    :subject_id => people[:patient].id, 
                    :caretaker_id => people[:caretaker][:person].id,
                    :survey_id => survey_id,
                    :created_at => created_at,
                    :deadline => created_at.advance(:weeks =>2),
                    :entry_set_response_id => entry_set_response_id
                    )
    
    responder_item
  end

end