class AddInvitedByTypeToUser < ActiveRecord::Migration
  def change
    add_column :users, :invited_by_type, :string
  end
end
