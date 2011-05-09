class RenamePersonColumnInResponderItems < ActiveRecord::Migration
  def self.up
    rename_column :responder_items, :person_id, :client_id
  end

  def self.down
    rename_column :responder_items, :client_id, :person_id
  end
end
