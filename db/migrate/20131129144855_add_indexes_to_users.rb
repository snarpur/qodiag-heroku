class AddIndexesToUsers < ActiveRecord::Migration
  def self.up
    add_index :users, :person_id, :name => 'users_index_person_id'
  end

  def self.down
    remove_index :users, :person_id
  end
end
