'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item_locations', {
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
      location_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'locations',
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
        type: Sequelize.ENUM('fifo', 'lifo', 'fefo', 'random', 'location_sequence'),
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
      current_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      reserved_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      picking_sequence: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      last_picked_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_replenished_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      cycle_count_date: {
        type: Sequelize.DATE,
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
    await queryInterface.addIndex('item_locations', ['item_id'], {
      name: 'idx_item_locations_item_id'
    });
    
    await queryInterface.addIndex('item_locations', ['location_id'], {
      name: 'idx_item_locations_location_id'
    });
    
    await queryInterface.addIndex('item_locations', ['item_id', 'location_id'], {
      unique: true,
      name: 'idx_item_locations_unique'
    });
    
    await queryInterface.addIndex('item_locations', ['item_id', 'is_preferred'], {
      name: 'idx_item_locations_item_preferred'
    });
    
    await queryInterface.addIndex('item_locations', ['allocation_rule'], {
      name: 'idx_item_locations_allocation_rule'
    });
    
    await queryInterface.addIndex('item_locations', ['current_quantity'], {
      name: 'idx_item_locations_current_quantity'
    });
    
    await queryInterface.addIndex('item_locations', ['reserved_quantity'], {
      name: 'idx_item_locations_reserved_quantity'
    });
    
    await queryInterface.addIndex('item_locations', ['picking_sequence'], {
      name: 'idx_item_locations_picking_sequence'
    });

    // Add check constraints
    await queryInterface.addConstraint('item_locations', {
      fields: ['min_quantity'],
      type: 'check',
      where: {
        min_quantity: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_item_locations_min_quantity_positive'
    });

    await queryInterface.addConstraint('item_locations', {
      fields: ['max_quantity'],
      type: 'check',
      where: {
        max_quantity: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_item_locations_max_quantity_positive'
    });

    await queryInterface.addConstraint('item_locations', {
      fields: ['replenishment_quantity'],
      type: 'check',
      where: {
        replenishment_quantity: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_item_locations_replenishment_quantity_positive'
    });

    await queryInterface.addConstraint('item_locations', {
      fields: ['current_quantity'],
      type: 'check',
      where: {
        current_quantity: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_item_locations_current_quantity_positive'
    });

    await queryInterface.addConstraint('item_locations', {
      fields: ['reserved_quantity'],
      type: 'check',
      where: {
        reserved_quantity: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_item_locations_reserved_quantity_positive'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('item_locations');
  }
};
