class CreateUsersHaveManyRolesThrough < ActiveRecord::Migration
  def self.up
    create_table :role_users do |t|
      t.references :role, :user
    end
  end

  def self.down
    drop_table :role_users
  end
end
