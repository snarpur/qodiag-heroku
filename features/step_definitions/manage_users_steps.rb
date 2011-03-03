When /^I choose a role$/ do
   msg = "cannot choose field, no radio button with id, name, or label with this locator found"
  find(:xpath, "//div[@class='field inp-rdo']/span[1]/input", :message => msg).set(true)
end