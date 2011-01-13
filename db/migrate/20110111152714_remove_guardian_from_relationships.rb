class RemoveGuardianFromRelationships < ActiveRecord::Migration
  def self.up
    remove_column :relationships, :guardian
  end

  def self.down
    add_column :relationships, :guardian, :boolean
  end
end
