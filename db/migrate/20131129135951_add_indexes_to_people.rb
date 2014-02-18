class AddIndexesToPeople < ActiveRecord::Migration
  def self.up
    add_index :people, :address_id, :name => 'people_index_address_id'
  end

  def self.down
    remove_index :people, :address_id
  end
end
