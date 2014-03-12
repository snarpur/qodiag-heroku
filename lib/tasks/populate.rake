  # encoding: utf-8
namespace :db do

  # !IMPORTANT national register setup => bundle exec rake db:data:load_dir dir=data

  #########################################################################################################################
  #
  #                                                   TASKS
  #
  #########################################################################################################################

  #db:populate_ini_file[users] -- create the users and execute the populators using "lib/tasks/default.ini" as INI file
  #db:populate_ini_file[users,file_name] -- create the users and execute the populators using file_name as INI file
  desc "populate database using ini file"
  task :populate_ini_file,:users,:file_name do |cmd,args|

  Rake::Task[:environment].invoke
    require 'faker'
    require 'ini_file'
    require "#{Rails.root}/lib/util/populate_util.rb"
    puts "command:: #{cmd.inspect}"
    puts "arguments:: #{args.inspect}"
    puts "args[:users]:: #{args[:users]}"
    puts "args[:file_name]:: #{args[:file_name]}"

    if args[:users].blank?
      puts "Users not found..."
      puts "You should specify at least one user...(db:populate_ini_file[user1:user2])"
      next
    end

    @users = args[:users].split(":")

    if args[:file_name].blank?
      puts "File name not found..."
      puts "...using lib/tasks/deafult.ini as config file"
      setup_file = "lib/tasks/default.ini"
    else
      puts "Using " + args[:file_name].to_s + " as config file"
      setup_file = "lib/tasks/"+args[:file_name].to_s
    end

    if not File.exist?(setup_file)
      puts "The config file doesn't exist"
      next
    end

    @ini = IniFile.load(setup_file)

    if @ini.nil?
      puts "There is an error with the config file. Probably it is not an INI file"
      next
    end

    get_data_from_ini_file

    populate_data
    
  end



  #db:populate_reset[reset] -- resets database and regenerates surveys using "lib/tasks/default.ini" as INI file
  #db:populate_reset[reset,file_name] -- resets database and regenerates surveys using file_name as INI file
  #db:populate_reset[user] --  clears users does not regenerate data
  desc "reset the database and generate the surveys DSL Files"
  task :populate_reset, :level, :file_name do |cmd, args|
    
    
    

  Rake::Task[:environment].invoke
    require 'faker'
    require "#{Rails.root}/lib/util/populate_util.rb"
    puts "command:: #{cmd.inspect}"
    puts "arguments:: #{args.inspect}"
    puts "args[:level]:: #{args[:level]}"
    
    @ini_file =  args[:file_name].blank? ? "lib/tasks/default.ini" : args[:file_name] 
    puts "args[:file_name]:: #{@ini_file}"

    if not File.exist?(@ini_file)
      puts "The config file doesn't exist"
      next
    end

    pop = PopulateUtil.new
    pop.reset_db(args[:level],@ini_file)  
  end

  #########################################################################################################################
  #
  #                                                   BLOCKS
  #
  #########################################################################################################################

  # Block that generate the data calling the populators
  def populate_data
    
    person_util = PersonPopulateUtil.new
    @users.each do |u|
      
      puts "createing caretaker #{u}"
      caretaker = person_util.create_caretaker(u)
      @patients.times do |p|
      
        patient = person_util.create_patient(caretaker[:person])
        parent = person_util.create_parent(patient)
        people = {:caretaker => caretaker, :patient => patient, :parent => parent}
        puts "patient created - #{patient.firstname}"
        
        if @surveys.length > 0
          survey_util = SurveyPopulateUtil.new(@surveys)
          @surveys.length.times do |t|
            survey_util.create_requests({:people => people, :number => @number_of_surveys, :survey_id => t+1})
          end
        end

        if @entry_sets > 0
          entry_set_util = EntrySetPopulateUtil.new
          @entry_sets.times do |e|
            if e == 2
              entry_set_util.create_entry_set_request(people,e,false)
            else
              entry_set_util.create_entry_set_request(people,e)
            end
          end
        end
      
      end
    end  
  end

  # Block that get the date from the INI config file
  def get_data_from_ini_file

    # Number of patients
    @patients = @ini[:patients][:num_patients].to_s.empty? ? 1 : @ini[:patients][:num_patients].to_i
    puts "Number of patients per caretaker: "
    puts @patients

    # Number of completed surveys
    if @ini[:surveys][:number_of_surveys].to_s.empty?
      @number_of_surveys = 0
      @surveys = []
    else
      @number_of_surveys = @ini[:surveys][:number_of_surveys].to_s.empty? ? 0 : @ini[:surveys][:number_of_surveys].to_i  
    end

    # Surveys
    if @ini[:surveys][:surveys].nil? or @ini[:surveys][:surveys].empty?
      @number_of_surveys = 0
      @surveys = []
    else
      @surveys = @ini[:surveys][:surveys].split(",")
    end

    puts "Surveys: "
    puts @surveys
    puts "Number of completed survey: "
    puts @number_of_surveys

    # Entry Sets
    @entry_sets = @ini[:entry_sets][:number_of_entry_sets].to_s.empty? ? 0 : @ini[:entry_sets][:number_of_entry_sets].to_i  
    puts "Number of entry sets: "
    puts @entry_sets

  end

end 