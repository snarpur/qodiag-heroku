# encoding: utf-8
namespace :db do
  desc "populate database with test data"
  task :populate, :level do |cmd, args|
    # e.g. db:populate[reset]
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

    ["jon","elsa"].each do |u|
      puts "createing caretaker #{u}"
      caretaker = pop.create_caretaker(u)
      2.times do |p|
          patient = pop.create_patient(caretaker[:person])
          parent = pop.create_parent(patient)
          people = {:caretaker => caretaker, :patient => patient, :parent => parent}
          puts "patient created - #{patient.firstname}"
        2.times do |t|
          pop.create_requests({:people => people, :number => 2, :survey_id => t+1})
        end
      end
    end
  end
end