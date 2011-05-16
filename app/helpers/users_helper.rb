module UsersHelper
  def registration_items(items,user)
    partial_items = []
    items.each do |item|
      registrations = user.person.registrations(item)
      unless registrations.empty?
       partial_items << {:name => item.to_s, :partial => "users/#{user.person.role}/responder_item", :locals => {:registrations => registrations}}
      end
    end
    partial_items
  end
end