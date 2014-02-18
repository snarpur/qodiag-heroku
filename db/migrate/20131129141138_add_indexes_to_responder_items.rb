class AddIndexesToResponderItems < ActiveRecord::Migration
  def self.up
    add_index :responder_items, :respondent_id, :name => 'responder_items_index_respondent_id'
    add_index :responder_items, :subject_id, :name => 'responder_items_index_subject_id'
    add_index :responder_items, :survey_id, :name => 'responder_items_index_survey_id'
    add_index :responder_items, :caretaker_id, :name => 'responder_items_index_caretaker_id'
    add_index :responder_items, :response_set_id, :name => 'responder_items_index_response_set_id'
    add_index :responder_items, :entry_set_response_id, :name => 'responder_items_index_entry_set_response_id'
  end

  def self.down
    remove_index :responder_items, :respondent_id
    remove_index :responder_items, :subject_id
    emove_index :responder_items, :survey_id
    remove_index :responder_items, :caretaker_id
    emove_index :responder_items, :response_set_id
    remove_index :responder_items, :entry_set_response_id
  end
end
