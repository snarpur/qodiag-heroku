require 'faker'
class PopulateUtil

	def self.fullname
		{:firstname => Faker::Name.first_name, :lastname => Faker::Name.last_name}
	end
end