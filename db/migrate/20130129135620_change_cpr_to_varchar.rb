class ChangeCprToVarchar < ActiveRecord::Migration
  def self.up
    remove_column :people, :cpr
    add_column :people, :cpr, :string
  end

  def self.down
    remove_column :people, :cpr
    add_column :people, :cpr, :int
  end
end
