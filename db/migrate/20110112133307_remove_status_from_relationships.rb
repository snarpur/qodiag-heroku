class RemoveStatusFromRelationships < ActiveRecord::Migration
  def self.up
    remove_column :relationships, :status
  end

  def self.down
    add_column :relationships, :status, :boolean
  end
end
