class SurveyDSLHelpers
	def self.access_code(name)
		name.downcase.gsub(/\s/, '-')
	end
end