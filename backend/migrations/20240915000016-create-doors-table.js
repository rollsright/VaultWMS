'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      warehouse_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      door_number: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('inbound', 'outbound', 'staging'),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      dimensions: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      equipment: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.addIndex('doors', ['warehouse_id'], {
      name: 'idx_doors_warehouse_id'
    });
    
    await queryInterface.addIndex('doors', ['warehouse_id', 'door_number'], {
      unique: true,
      name: 'idx_doors_warehouse_door_number'
    });
    
    await queryInterface.addIndex('doors', ['warehouse_id', 'type'], {
      name: 'idx_doors_warehouse_type'
    });
    
    await queryInterface.addIndex('doors', ['warehouse_id', 'status'], {
      name: 'idx_doors_warehouse_status'
    });
    
    await queryInterface.addIndex('doors', ['type'], {
      name: 'idx_doors_type'
    });

    // Add check constraints
    await queryInterface.addConstraint('doors', {
      fields: ['door_number'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('door_number')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('door_number')), '<=', 50)
        ]
      },
      name: 'chk_doors_door_number_length'
    });

    await queryInterface.addConstraint('doors', {
      fields: ['name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '<=', 255)
        ]
      },
      name: 'chk_doors_name_length'
    });

    await queryInterface.addConstraint('doors', {
      fields: ['capacity'],
      type: 'check',
      where: {
        capacity: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_doors_capacity_positive'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('doors');
  }
};
