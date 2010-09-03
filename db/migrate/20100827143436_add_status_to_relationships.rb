class AddStatusToRelationships < ActiveRecord::Migration
  def self.up
    add_column :relationships, :status, :integer
  end

  def self.down
    remove_column :relationships, :status
  end
end
