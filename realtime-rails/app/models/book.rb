class Book < ActiveRecord::Base

  after_create {|book| book.message 'create' }
  after_update {|book| book.message 'update' }
  after_destroy {|book| book.message 'destroy' }

  def message action
    msg = { resource: 'books',
            action: action,
            id: self.id,
            obj: self }
    puts action + ' a book!...'
    $redis.publish 'live-changes', msg.to_json
  end
end