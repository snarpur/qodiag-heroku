# encoding: utf-8
namespace :db do
  
  desc "populate database with test data"
  task :populate_reset, :level do |cmd, args|
    #db:populate_reset[reset] -- resets database
    #db:populate_reset[reset] -- regenerates surveys, regenerates user data
    #db:populate_reset[user] -- clears users does not regenerate data, to regenerate users call  db:populate_users[some_user_name]
    
  Rake::Task[:environment].invoke
    require 'faker'
    require "#{Rails.root}/lib/util/populate_util.rb"
    puts "command:: #{cmd.inspect}"
    puts "arguments:: #{args.inspect}"
    puts "args[:level]:: #{args[:level]}"
    pop = PopulateUtil.new
    pop.reset_db(args[:level])  
  end

  desc "populate database with test data for user"
  task :populate_users, :users do |cmd, args|
    # e.g. db:populate_users[jonni]

  Rake::Task[:environment].invoke
    puts "in the nested task"
    require 'faker'
    require "#{Rails.root}/lib/util/populate_util.rb"
    users = args[:users].split(":")
    puts users.inspect
    pop = PopulateUtil.new
    users.each do |u|
      puts "createing caretaker #{u}"
      caretaker = pop.create_caretaker(u)
      2.times do |p|
        patient = pop.create_patient(caretaker[:person])
        parent = pop.create_parent(patient)
        people = {:caretaker => caretaker, :patient => patient, :parent => parent}
        puts "patient created - #{patient.firstname}"
        3.times do |t|
          pop.create_requests({:people => people, :number => 5, :survey_id => t+1})
        end
        3.times do |e|
          pop.create_entry_set_request(people,e)
        end
      end
    end
  end
end 