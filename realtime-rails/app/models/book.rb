class Book < ActiveRecord::Base
  # no attr_accessible in rails4, yr supposed to use strong params(?)
  #attr_accessible :num_pages, :title
  after_create {|book| book.message 'create' }
  after_update {|book| book.message 'update' }
  after_destroy {|book| book.message 'destroy' }

  def message action
    msg = { resource: 'books',
            action: action,
            id: self.id,
            obj: self }

    $redis.publish 'rt-change', msg.to_json
  end
end