class BooksController < ApplicationController
  def index
    @books = Book.all
  end

  def show
    @book = Book.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render json: @book }
    end
  end

end
