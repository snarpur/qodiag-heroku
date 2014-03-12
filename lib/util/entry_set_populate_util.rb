# encoding: utf-8
require 'faker'
class EntrySetPopulateUtil < ResponderItemPopulateUtil

  def initialize    
    @entries = YAML::load(File.open("#{Rails.root}/lib/util/entry_values.yml")).symbolize_all_keys![:entries]
    @entry_set_ids = EntrySet.select(:id)
    # super
  end

  def create_entry_set_request(people,entry_set_no,completed=true)
    entry_set_response = FactoryGirl.create(:entry_set_response,:entry_set_id =>  @entry_set_ids[entry_set_no].id, :responder_item_id => nil)
    responder_item = self.create_responder_item(nil,people,Time.zone.now,entry_set_response.id)
    

    if completed == true
      completed_at = responder_item.created_at.advance(:days => (rand(5)+1))
      responder_item.update_attribute("completed",completed_at)
      entry_set_response.entry_set.sections.each_with_index do |section, section_index|
        
        random_entry = rand(32)
        section.entry_fields.each_with_index do |entry_field, ef_index|
          random_index = random_entry + ef_index
          entry_value = entry_field.entry_values.create({
                                                          :text_value => @entries[random_entry + ef_index],
                                                          :person_id => people[:parent][:person].id,
                                                          :entry_set_response_id => entry_set_response.id
                                                        })
          
          random_comment = random_index > 13 ? rand(0..13) : rand(15..33)

          2.times do |t|
            entry_value.comments.create({
              :text_value =>  @entries[random_comment + t+1],
              :person_id => people[:caretaker][:person].id, 
              :entry_field_id => entry_field.id,
              :entry_set_response_id => entry_set_response.id
              })
            
          end
        end
      end
    end
  end

end