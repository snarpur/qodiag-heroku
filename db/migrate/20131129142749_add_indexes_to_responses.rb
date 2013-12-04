class AddIndexesToResponses < ActiveRecord::Migration
  def self.up
    add_index :responses, :response_set_id, :name => 'responses_index_response_set_id'
    add_index :responses, :question_id, :name => 'responses_index_question_id'
    add_index :responses, :answer_id, :name => 'responses_index_answer_id'
  end

  def self.down
    remove_index :responses, :response_set_id
    remove_index :responses, :question_id
    remove_index :responses, :answer_id
  end
end
