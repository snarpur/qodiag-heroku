class AddDetailsToPeople < ActiveRecord::Migration
  def self.up
    add_column :people, :mobilephone, :string
    add_column :people, :workphone, :string
    add_column :people, :occupation, :string
    add_column :people, :workplace, :string
  end

  def self.down
    remove_column :people, :workplace
    remove_column :people, :occupation
    remove_column :people, :workphone
    remove_column :people, :mobilephone
  end
end
