'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('zones', {
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
      zone_code: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      zone_type: {
        type: Sequelize.ENUM('receiving', 'staging', 'storage', 'picking', 'packing', 'shipping', 'quarantine', 'returns', 'cross_dock'),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      capacity_unit: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'pallets'
      },
      temperature_controlled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      temperature_min: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      temperature_max: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      humidity_controlled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      humidity_min: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      humidity_max: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      restrictions: {
        type: Sequelize.JSONB,
        defaultValue: {}
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
    await queryInterface.addIndex('zones', ['warehouse_id'], {
      name: 'idx_zones_warehouse_id'
    });
    
    await queryInterface.addIndex('zones', ['warehouse_id', 'zone_code'], {
      unique: true,
      name: 'idx_zones_warehouse_code'
    });
    
    await queryInterface.addIndex('zones', ['warehouse_id', 'zone_type'], {
      name: 'idx_zones_warehouse_type'
    });
    
    await queryInterface.addIndex('zones', ['zone_type'], {
      name: 'idx_zones_type'
    });
    
    await queryInterface.addIndex('zones', ['warehouse_id', 'is_active'], {
      name: 'idx_zones_warehouse_active'
    });

    // Add check constraints
    await queryInterface.addConstraint('zones', {
      fields: ['name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '<=', 255)
        ]
      },
      name: 'chk_zones_name_length'
    });

    await queryInterface.addConstraint('zones', {
      fields: ['zone_code'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('zone_code')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('zone_code')), '<=', 50)
        ]
      },
      name: 'chk_zones_code_length'
    });

    await queryInterface.addConstraint('zones', {
      fields: ['capacity'],
      type: 'check',
      where: {
        capacity: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_zones_capacity_positive'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('zones');
  }
};
