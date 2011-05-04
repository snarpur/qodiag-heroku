class CreateResponderItems < ActiveRecord::Migration
  def self.up
    create_table :responder_items do |t|
      t.integer :person_id
      t.integer :subject_id
      t.integer :survey_id
      t.string :registration_identifier
      t.date :deadline
      t.date :completed
      t.timestamps
    end
  end

  def self.down
    drop_table :responder_items
  end
end
