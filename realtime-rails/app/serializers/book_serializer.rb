class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :author, :num_pages
end
