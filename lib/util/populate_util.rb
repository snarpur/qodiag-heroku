# encoding: utf-8
require 'faker'
require 'ini_file'
class PopulateUtil

  # Get the available surveys from the file which name is passing by params
  def get_surveys(file_name)

    ini = IniFile.load(file_name)

    if ini.nil?
      puts "There is an error with the config file. Probably it doesn't exist"
      @surveys = []
    else
      if ini[:surveys][:surveys].nil? or ini[:surveys][:surveys].empty?
        @surveys = []
      else
        @surveys = ini[:surveys][:surveys].split(",")
      end
    end
    @surveys
  end

  def reset_db(reset,file_name)
    puts "Filename in reset db"
    puts file_name
    self.send("#{reset}_level",file_name)
  end

  def reset_level(file_name)
    Rake::Task["db:drop"].invoke
    Rake::Task["db:setup"].invoke
    @surveys = self.get_surveys(file_name)
    survey_util = SurveyPopulateUtil.new(@surveys)
    survey_util.generate_surveys
  end

  def user_level(file_name)
    puts "clearing users"
    self.clear_user_tables
  end

  def survey_level(file_name)
    @surveys = self.get_surveys(file_name)
    survey_util = SurveyPopulateUtil.new(@surveys)
    survey_util.generate_surveys
  end

  def clear_user_tables
    [Person, User, Right, Relationship, ResponderItem, ResponseSet, Response, EntryValue, EntrySetResponse].each(&:delete_all)
  end
  
end