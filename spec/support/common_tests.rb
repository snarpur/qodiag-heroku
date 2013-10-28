shared_examples "common tests" do |verbs, roles, factory, factory_name|
  verbs.each do |verb|
    context "#{verb[:action].upcase} #{verb[:path].upcase} #{verb[:action].upcase}" do
      roles.each do |rol|
        context "as a #{rol.upcase}" do
          before :each do
            if rol != "guest"     
              sign_in_as_a_valid_user(rol)     
            end

            @action = verb[:name] + " " +verb[:path]

            case verb[:action]
            when "show", "delete"      
                @action += "(#{factory[:id]})"
                
            when "create"             
                @action += ", #{factory_name}: @#{factory_name}"
            when "update"              
                @action += "(#{factory[:id]}), #{factory_name}: @#{factory_name}"
            end

            if verb.has_key?(:format) 
              @action += ", :format => :json" 
            end

          end

          if rol == "respondent" or rol == "pre_registered"
            it "Gives us the expected status code 401" do
              eval @action
              response.status.should be(401)
            end

            it "Renders Error 401 page" do
              eval @action
              expect(response).to render_template("pages/error_401")
            end
          else
            if rol == "guest"
              it "Renders Error 401 login page" do
                eval @action
                expect(response).to render_template("pages/error_401_login")
              end
            
              it "Gives us the expected status code 401" do
                eval @action
                response.status.should be(401)
              end
 
            else
              status_code = if verb.has_key?(:status_ok) then verb[:status_ok] else 200 end
              it "Gives us the expected status code (#{status_code})" do
                eval @action
                response.status.should be(status_code)
              end

              if verb.has_key?(:render)
                it "Renders #{verb[:action].upcase} template" do
                  eval @action
                  expect(response).to render_template(verb[:render])
                end
              end

              if verb[:action] == "create"
                it "saves the new #{factory_name.upcase} in the database" do
                  expect{ eval @action }.to change(described_class, :count).by(1)
                end
              end

              if verb[:action] == "delete"
                it "deletes the #{factory_name.upcase} from the database" do
                  expect{ eval @action }.to change(described_class, :count).by(-1)
                end
              end
            end  
          end
        end
      end
    end
  end
end