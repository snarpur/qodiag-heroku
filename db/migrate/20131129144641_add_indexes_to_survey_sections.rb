class AddIndexesToSurveySections < ActiveRecord::Migration
  def self.up
    add_index :survey_sections, :survey_id, :name => 'survey_sections_index_survey_id'
  end

  def self.down
    remove_index :survey_sections, :survey_id
  end
end
