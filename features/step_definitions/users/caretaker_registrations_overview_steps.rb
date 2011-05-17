Then /^I see (.*@.*\..*) in uncompleted registrations$/ do |email|
  client = User.find_by_email(email).person
  patient = Person.joins(:inverse_relationships).where(:relationships => {:name => 'guardian', :person_id => client.id}).first
  within(".uncompleted.registration") do
    page.should have_content("#{client.firstname} #{client.lastname}")
    page.should have_content("#{patient.firstname} #{patient.lastname}")
  end
end
