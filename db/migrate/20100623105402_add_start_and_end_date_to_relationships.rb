class AddStartAndEndDateToRelationships < ActiveRecord::Migration
  def self.up
    add_column :relationships, :start, :date
    add_column :relationships, :end, :date
  end

  def self.down
    remove_column :relationships, :end
    remove_column :relationships, :start
  end
end
