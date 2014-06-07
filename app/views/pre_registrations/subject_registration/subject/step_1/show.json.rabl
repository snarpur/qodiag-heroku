object @responder_item
attributes :id
node(:complete_item){"1"}
child :subject => :subject do
  attributes :id, :firstname, :lastname, :sex, :full_cpr
  child :address do
    attributes :id, :street_1, :street_2, :town, :zip_code, :phone, :home_phone
  end
end