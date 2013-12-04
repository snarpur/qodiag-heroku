class AddIndexesToRights < ActiveRecord::Migration
  def self.up
    add_index :rights, :role_id, :name => 'rights_index_role_id'
    add_index :rights, :user_id, :name => 'rights_index_user_id'
  end

  def self.down
    remove_index :rights, :role_id
    remove_index :rights, :user_id
  end
end
