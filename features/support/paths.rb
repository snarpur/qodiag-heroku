module NavigationHelpers
  # Maps a name to a path. Used by the
  #
  #   When /^I go to (.+)$/ do |page_name|
  #
  # step definition in web_steps.rb
  #
  def path_to(page_name)
    case page_name
    when /root page/
      root_path
    when /sign in page/
      '/login'
    when /pending registrations page/
      responder_items_path
    when /client invitation page/
      '/invitation/new/3'
    when /caretaker invitation page/
      '/invitation/new/2'
    when /confirmation page for (.+)$/i
     "#{accept_user_invitation_path}?invitation_token=#{User.find_by_email($1).invitation_token}"
    when /users page/
      users_path
    when /home\s?page/
      '/'
    # Add more mappings here.
    # Here is an example that pulls values out of the Regexp:
    #
    #   when /^(.*)'s profile page$/i
    #     user_profile_path(User.find_by_login($1))

    else
      begin
        page_name =~ /the (.*) page/
        path_components = $1.split(/\s+/)
        self.send(path_components.push('path').join('_').to_sym)
      rescue Object => e
        raise "Can't find mapping from \"#{page_name}\" to a path.\n" +
          "Now, go and add a mapping in #{__FILE__}"
      end
    end
  end
end

World(NavigationHelpers)
