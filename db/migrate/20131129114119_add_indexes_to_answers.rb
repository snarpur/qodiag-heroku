class AddIndexesToAnswers < ActiveRecord::Migration
  def self.up
    add_index :answers, :question_id, :name => 'index_question_id'
  end

  def self.down
    remove_index :answers, :question_id
  end
end