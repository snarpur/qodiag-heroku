class AddIndexesToNormReferences < ActiveRecord::Migration
  def self.up
    add_index :norm_references, :survey_id, :name => 'norm_references_index_survey_id'
  end

  def self.down
    remove_index :norm_references, :survey_id
  end
end
