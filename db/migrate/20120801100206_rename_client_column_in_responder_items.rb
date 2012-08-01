class RenameClientColumnInResponderItems < ActiveRecord::Migration
  def self.up
    rename_column :responder_items, :client_id, :respondent_id
  end

  def self.down
    rename_column :responder_items, :respondent_id, :client_id
  end

end
