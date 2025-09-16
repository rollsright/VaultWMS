'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('uoms', {
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
      uom_code: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      uom_type: {
        type: Sequelize.ENUM('base', 'case', 'pallet', 'carton', 'box', 'pack', 'bundle', 'roll', 'sheet', 'length', 'weight', 'volume', 'custom'),
        allowNull: false
      },
      conversion_factor: {
        type: Sequelize.DECIMAL(15, 6),
        allowNull: false,
        defaultValue: 1.0
      },
      base_uom_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'uoms',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      is_base_uom: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      dimensions: {
        type: Sequelize.JSONB,
        defaultValue: {}
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
      barcode: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      gtin: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      is_sellable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      is_purchasable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      is_trackable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
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
    await queryInterface.addIndex('uoms', ['item_id'], {
      name: 'idx_uoms_item_id'
    });
    
    await queryInterface.addIndex('uoms', ['item_id', 'uom_code'], {
      unique: true,
      name: 'idx_uoms_item_code'
    });
    
    await queryInterface.addIndex('uoms', ['base_uom_id'], {
      name: 'idx_uoms_base_uom_id'
    });
    
    await queryInterface.addIndex('uoms', ['item_id', 'is_base_uom'], {
      name: 'idx_uoms_item_base'
    });
    
    await queryInterface.addIndex('uoms', ['item_id', 'is_default'], {
      name: 'idx_uoms_item_default'
    });
    
    await queryInterface.addIndex('uoms', ['uom_type'], {
      name: 'idx_uoms_type'
    });
    
    await queryInterface.addIndex('uoms', ['barcode'], {
      name: 'idx_uoms_barcode'
    });
    
    await queryInterface.addIndex('uoms', ['gtin'], {
      name: 'idx_uoms_gtin'
    });
    
    await queryInterface.addIndex('uoms', ['item_id', 'is_active'], {
      name: 'idx_uoms_item_active'
    });

    // Add check constraints
    await queryInterface.addConstraint('uoms', {
      fields: ['uom_code'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('uom_code')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('uom_code')), '<=', 20)
        ]
      },
      name: 'chk_uoms_code_length'
    });

    await queryInterface.addConstraint('uoms', {
      fields: ['name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '<=', 100)
        ]
      },
      name: 'chk_uoms_name_length'
    });

    await queryInterface.addConstraint('uoms', {
      fields: ['conversion_factor'],
      type: 'check',
      where: {
        conversion_factor: {
          [Sequelize.Op.gt]: 0
        }
      },
      name: 'chk_uoms_conversion_factor_positive'
    });

    await queryInterface.addConstraint('uoms', {
      fields: ['weight'],
      type: 'check',
      where: {
        weight: {
          [Sequelize.Op.gte]: 0
        }
      },
      name: 'chk_uoms_weight_positive'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('uoms');
  }
};
