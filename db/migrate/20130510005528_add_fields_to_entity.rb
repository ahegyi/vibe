class AddFieldsToEntity < ActiveRecord::Migration
  def change
    add_column :entities, :username, :string
    add_column :entities, :real_name, :string
    add_column :entities, :posted_at, :datetime
  end
end
