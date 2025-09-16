'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item_zones', {
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
      zone_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'zones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      is_preferred: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      allocation_rule: {
        type: Sequelize.ENUM('fifo', 'lifo', 'fefo', 'random', 'zone_sequence'),
        allowNull: false,
        defaultValue: 'fifo'
      },
      min_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      max_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      replenishment_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true
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
    await queryInterface.addIndex('item_zones', ['item_id'], {
      name: 'idx_item_zones_item_id'
    });
    
    await queryInterface.addIndex('item_zones', ['zone_id'], {
      name: 'idx_item_zones_zone_id'
    });
    
    await queryInterface.addIndex('item_zones', ['item_id', 'zone_id'], {
      unique: true,
      name: 'idx_item_zones_unique'
    });
    
    await queryInterface.addIndex('item_zones', ['item_id', 'is_preferred'], {
      name: 'idx_item_zones_item_preferred'
    });
    
    await queryInterface.addIndex('item_zones', ['allocation_rule'], {
      name: 'idx_item_zones_allocation_rule'
    });

    // Add check constraints
    await queryInterface.addConstraint('item_zones', {
      fields: ['min_quantity'],
      type: 'check',
      where: {
        min_quantity: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_item_zones_min_quantity_positive'
    });

    await queryInterface.addConstraint('item_zones', {
      fields: ['max_quantity'],
      type: 'check',
      where: {
        max_quantity: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_item_zones_max_quantity_positive'
    });

    await queryInterface.addConstraint('item_zones', {
      fields: ['replenishment_quantity'],
      type: 'check',
      where: {
        replenishment_quantity: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_item_zones_replenishment_quantity_positive'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('item_zones');
  }
};
