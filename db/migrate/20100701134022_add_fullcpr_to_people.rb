class AddFullcprToPeople < ActiveRecord::Migration
  def self.up
    add_column :people, :dateofbirth, :date
    add_column :people, :cpr, :integer
  end

  def self.down
    remove_column :people, :cpr
    remove_column :people, :dateofbirth
  end
end
