# encoding: utf-8
namespace :db do
  desc "Erase and fill database"
  task :populate, :level do |cmd, args|
    #:level => reset -- resets database
    #:level => user -- delete user records and refill
    #:surveys =>  -- regenerates surveys, regenerates user data
    Rake::Task[:environment].invoke
    require 'faker'
    require "#{Rails.root}/lib/util/populate_util.rb"
    puts cmd.inspect
    puts args.inspect
    puts "args[:level] #{args[:level]}"
    pop = PopulateUtil.new
    pop.reset_db(args[:level])  

    ["jon"].each do |u|
      caretaker = pop.create_caretaker(u)
      25.times do |p|
          patient = pop.create_patient(caretaker[:person])
          parent = pop.create_parent(patient)
          people = {:caretaker => caretaker, :patient => patient, :parent => parent}
        2.times do |t|
          pop.create_requests({:people => people, :number => 5, :survey_id => t+1})
        end
      end
    end
  end
end