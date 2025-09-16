'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('items', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      customer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      item_code: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      customer_item_code: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      brand: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      model: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      sku: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      upc: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      ean: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      item_type: {
        type: Sequelize.ENUM('finished_good', 'raw_material', 'component', 'packaging', 'consumable', 'tool', 'equipment'),
        allowNull: false,
        defaultValue: 'finished_good'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'discontinued', 'pending_approval'),
        allowNull: false,
        defaultValue: 'active'
      },
      unit_cost: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: true
      },
      unit_price: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: true
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: true,
        defaultValue: 'USD'
      },
      weight: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true
      },
      weight_unit: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'lbs'
      },
      dimensions: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      volume: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true
      },
      volume_unit: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 'cubic_feet'
      },
      hazmat: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      hazmat_class: {
        type: Sequelize.STRING(50),
        allowNull: true
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
      expiration_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      shelf_life_days: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      lot_tracking: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      serial_tracking: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      reorder_point: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      reorder_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      safety_stock: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      max_stock: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      abc_classification: {
        type: Sequelize.ENUM('A', 'B', 'C'),
        allowNull: true
      },
      velocity_classification: {
        type: Sequelize.ENUM('fast', 'medium', 'slow'),
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      attributes: {
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
    await queryInterface.addIndex('items', ['customer_id'], {
      name: 'idx_items_customer_id'
    });
    
    await queryInterface.addIndex('items', ['customer_id', 'item_code'], {
      unique: true,
      name: 'idx_items_customer_code'
    });
    
    await queryInterface.addIndex('items', ['customer_id', 'customer_item_code'], {
      name: 'idx_items_customer_item_code'
    });
    
    await queryInterface.addIndex('items', ['name'], {
      name: 'idx_items_name'
    });
    
    await queryInterface.addIndex('items', ['sku'], {
      name: 'idx_items_sku'
    });
    
    await queryInterface.addIndex('items', ['upc'], {
      name: 'idx_items_upc'
    });
    
    await queryInterface.addIndex('items', ['ean'], {
      name: 'idx_items_ean'
    });
    
    await queryInterface.addIndex('items', ['item_type'], {
      name: 'idx_items_type'
    });
    
    await queryInterface.addIndex('items', ['status'], {
      name: 'idx_items_status'
    });
    
    await queryInterface.addIndex('items', ['customer_id', 'is_active'], {
      name: 'idx_items_customer_active'
    });
    
    await queryInterface.addIndex('items', ['abc_classification'], {
      name: 'idx_items_abc_classification'
    });
    
    await queryInterface.addIndex('items', ['velocity_classification'], {
      name: 'idx_items_velocity_classification'
    });

    // Add check constraints
    await queryInterface.addConstraint('items', {
      fields: ['item_code'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('item_code')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('item_code')), '<=', 100)
        ]
      },
      name: 'chk_items_code_length'
    });

    await queryInterface.addConstraint('items', {
      fields: ['name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '<=', 255)
        ]
      },
      name: 'chk_items_name_length'
    });

    await queryInterface.addConstraint('items', {
      fields: ['unit_cost'],
      type: 'check',
      where: {
        unit_cost: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_items_unit_cost_positive'
    });

    await queryInterface.addConstraint('items', {
      fields: ['unit_price'],
      type: 'check',
      where: {
        unit_price: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_items_unit_price_positive'
    });

    await queryInterface.addConstraint('items', {
      fields: ['weight'],
      type: 'check',
      where: {
        weight: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_items_weight_positive'
    });

    await queryInterface.addConstraint('items', {
      fields: ['shelf_life_days'],
      type: 'check',
      where: {
        shelf_life_days: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_items_shelf_life_positive'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('items');
  }
};
