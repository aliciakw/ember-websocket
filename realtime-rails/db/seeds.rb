# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Book.create(title:"Taipei", author:"Tao Lin", num_pages: 248)
Book.create(title:"On Beauty", author:"Zadie Smith", num_pages: 445)
Book.create(title:"Fun Home", author:"Alison Bechdel", num_pages: 234)
Book.create(title:"100 Years of Solitude", author:"Gabriel Garcia Marquez", num_pages: 457)
Book.create(title:"Threats", author: "Amelia Gray", num_pages:278)