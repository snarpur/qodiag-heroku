class AddAvatarToPerson < ActiveRecord::Migration
  def up
    add_column :people, :avatar_file_name, :string
    add_column :people, :avatar_content_type, :string
    add_column :people, :avatar_file_size, :integer
  end

  def down
    remove_column :people, :avatar_file_name
    remove_column :people, :avatar_content_type
    remove_column :people, :avatar_file_size
  end
end
