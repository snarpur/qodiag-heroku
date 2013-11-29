class AddIndexesToResponseSets < ActiveRecord::Migration
  def self.up
    add_index :response_sets, :user_id, :name => 'response_sets_index_user_id'
    add_index :response_sets, :survey_id, :name => 'response_sets_index_survey_id'
  end

  def self.down
    remove_index :response_sets, :user_id
    remove_index :response_sets, :survey_id
  end
end
