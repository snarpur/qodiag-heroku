class AddIspatientToPeople < ActiveRecord::Migration
  def self.up
    add_column :people, :ispatient, :boolean
  end

  def self.down
    remove_column :people, :ispatient
  end
end
