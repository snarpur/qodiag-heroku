class AddGuardianToRelationships < ActiveRecord::Migration
  def self.up
    add_column :relationships, :guardian, :boolean
  end

  def self.down
    remove_column :relationships, :guardian
  end
end
