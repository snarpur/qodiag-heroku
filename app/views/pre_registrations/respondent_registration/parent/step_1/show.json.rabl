object @responder_item
attributes :id
child :subject => :subject do
  attributes :id, :firstname, :lastname, :sex, :full_cpr
  child :address do
    attributes :id, :street_1, :street_2, :town, :zip_code, :phone, :home_phone
    node(:paramRoot){"address"}
  end
end
