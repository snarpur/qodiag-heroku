require 'csv'
class NormReferenceCSVParser
  def parse
    csv = self.read_csv(:adhd_rating_scale)
    survey_id = self.get_survey_id(csv)
    header = self.extract_header!(csv)

    norm = {}
    score = []
    csv.each do |row|
      row.each_index do |value|
        field = header[value]
        value = row[value]
        unless field.starts_with?('score')
          norm[field.to_sym] = value
        else
          puts "creating score with #{field} = #{value}"
        end
      end
      puts "_________"
    end
  end

  def read_csv(file)
    CSV.read("#{Rails.root}/db/survey_data_references/#{file}/norm.csv")
  end

  def extract_header!(csv)
      header = csv.shift
  end

  def get_survey_id(csv)
    survey_access_code = csv[1][csv[0].index('survey')]
    survey_id = Survey.find_by_access_code(survey_access_code).id
  end
end