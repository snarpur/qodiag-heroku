class AddIndexesToQuestions < ActiveRecord::Migration
  def self.up
    add_index :questions, :survey_section_id, :name => 'questions_index_survey_section_id'
    add_index :questions, :question_group_id, :name => 'questions_index_question_group_id'
    add_index :questions, :correct_answer_id, :name => 'questions_index_correct_answer_id'
  end

  def self.down
    remove_index :questions, :survey_section_id
    remove_index :questions, :question_group_id
    remove_index :questions, :correct_answer_id
  end
end
