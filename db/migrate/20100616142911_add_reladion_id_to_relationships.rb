class AddReladionIdToRelationships < ActiveRecord::Migration
  def self.up
    add_column :relationships, :relation_id, :integer
  end

  def self.down
    remove_column :relationships, :relation_id
  end
end
