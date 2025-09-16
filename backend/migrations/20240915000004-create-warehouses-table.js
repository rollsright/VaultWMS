'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('warehouses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      tenant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tenants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      warehouse_code: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      address: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      manager_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      manager_email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      manager_phone: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      operating_hours: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      timezone: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: 'UTC'
      },
      total_capacity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      capacity_unit: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'square_feet'
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
    await queryInterface.addIndex('warehouses', ['tenant_id'], {
      name: 'idx_warehouses_tenant_id'
    });
    
    await queryInterface.addIndex('warehouses', ['tenant_id', 'warehouse_code'], {
      unique: true,
      name: 'idx_warehouses_tenant_code'
    });
    
    await queryInterface.addIndex('warehouses', ['tenant_id', 'is_active'], {
      name: 'idx_warehouses_tenant_active'
    });
    
    await queryInterface.addIndex('warehouses', ['name'], {
      name: 'idx_warehouses_name'
    });

    // Add check constraints
    await queryInterface.addConstraint('warehouses', {
      fields: ['name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '<=', 255)
        ]
      },
      name: 'chk_warehouses_name_length'
    });

    await queryInterface.addConstraint('warehouses', {
      fields: ['warehouse_code'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('warehouse_code')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('warehouse_code')), '<=', 50)
        ]
      },
      name: 'chk_warehouses_code_length'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('warehouses');
  }
};
