'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('locations', {
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
      zone_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'zones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      location_code: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      location_type: {
        type: Sequelize.ENUM('floor', 'rack', 'shelf', 'bin', 'dock', 'staging_area', 'bulk_area'),
        allowNull: false,
        defaultValue: 'floor'
      },
      aisle: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      bay: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      level: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      position: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      coordinates: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      dimensions: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      capacity_unit: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'units'
      },
      weight_limit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      weight_unit: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'lbs'
      },
      barcode: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      qr_code: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      picking_sequence: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_pickable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      is_bulk_location: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.addIndex('locations', ['warehouse_id'], {
      name: 'idx_locations_warehouse_id'
    });
    
    await queryInterface.addIndex('locations', ['zone_id'], {
      name: 'idx_locations_zone_id'
    });
    
    await queryInterface.addIndex('locations', ['warehouse_id', 'location_code'], {
      unique: true,
      name: 'idx_locations_warehouse_code'
    });
    
    await queryInterface.addIndex('locations', ['warehouse_id', 'location_type'], {
      name: 'idx_locations_warehouse_type'
    });
    
    await queryInterface.addIndex('locations', ['barcode'], {
      name: 'idx_locations_barcode'
    });
    
    await queryInterface.addIndex('locations', ['qr_code'], {
      name: 'idx_locations_qr_code'
    });
    
    await queryInterface.addIndex('locations', ['picking_sequence'], {
      name: 'idx_locations_picking_sequence'
    });
    
    await queryInterface.addIndex('locations', ['warehouse_id', 'is_active'], {
      name: 'idx_locations_warehouse_active'
    });

    // Add check constraints
    await queryInterface.addConstraint('locations', {
      fields: ['location_code'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('location_code')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('location_code')), '<=', 50)
        ]
      },
      name: 'chk_locations_code_length'
    });

    await queryInterface.addConstraint('locations', {
      fields: ['capacity'],
      type: 'check',
      where: {
        capacity: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_locations_capacity_positive'
    });

    await queryInterface.addConstraint('locations', {
      fields: ['weight_limit'],
      type: 'check',
      where: {
        weight_limit: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_locations_weight_positive'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('locations');
  }
};
