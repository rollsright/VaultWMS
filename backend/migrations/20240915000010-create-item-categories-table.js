'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item_categories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('item_categories', ['item_id'], {
      name: 'idx_item_categories_item_id'
    });
    
    await queryInterface.addIndex('item_categories', ['category_id'], {
      name: 'idx_item_categories_category_id'
    });
    
    await queryInterface.addIndex('item_categories', ['item_id', 'category_id'], {
      unique: true,
      name: 'idx_item_categories_unique'
    });
    
    await queryInterface.addIndex('item_categories', ['item_id', 'is_primary'], {
      name: 'idx_item_categories_item_primary'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('item_categories');
  }
};
