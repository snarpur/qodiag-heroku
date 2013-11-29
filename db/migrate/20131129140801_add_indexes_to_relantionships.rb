class AddIndexesToRelantionships < ActiveRecord::Migration
  def self.up
    add_index :relationships, :person_id, :name => 'relationships_index_person_id'
    add_index :relationships, :relation_id, :name => 'relationships_index_relation_id'
  end

  def self.down
    remove_index :relationships, :person_id
    remove_index :relationships, :relation_id
  end
end
