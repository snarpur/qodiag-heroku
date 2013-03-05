extends"#{@responder_item.pre_registration_base_template}/form_model"
object @responder_item
attributes :id
child :subject => :subject do
  attributes :id, :firstname, :lastname, :sex, :full_cpr
  node(:object_class){"person"}
end