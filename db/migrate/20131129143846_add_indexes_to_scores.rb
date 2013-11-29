class AddIndexesToScores < ActiveRecord::Migration
  def self.up
    add_index :scores, :norm_reference_id, :name => 'scores_index_norm_reference_id'
  end

  def self.down
    remove_index :scores, :norm_reference_id
  end
end
