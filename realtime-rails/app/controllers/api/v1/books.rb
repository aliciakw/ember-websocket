module API
  module V1
    class Books < Grape::API
      include API::V1::Defaults

      resource :books do
        desc "Return all books"
        get "", root: :books do
          Book.all
        end

        desc "Return a book"
        params do
          requires :id, type: String, desc: "ID of the book"
        end
        get ":id", root: "book" do
          Book.where(id: permitted_params[:id]).first!
        end
      end
    end
  end
end
