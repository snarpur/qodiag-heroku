extends"#{@responder_item.pre_registration_base_template}/form_model"
object @responder_item
attributes :id
node(:complete_item){"1"}
child :respondent => :respondent do |person|
  attributes :id, :firstname, :lastname, :sex, :full_cpr, :occupation, :workplace
  
  node(:paramRoot){"person"}
  
  child :address do
    attributes :id, :street_1, :street_2, :town, :zip_code, :phone, :home_phone
    node(:paramRoot){"address"}
  end
end
child :subject => :subject do
  attributes :id
end
