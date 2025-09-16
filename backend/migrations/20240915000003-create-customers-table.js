'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
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
      customer_code: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      contact_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      contact_email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      contact_phone: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      billing_address: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      shipping_address: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      payment_terms: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      credit_limit: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.addIndex('customers', ['tenant_id'], {
      name: 'idx_customers_tenant_id'
    });
    
    await queryInterface.addIndex('customers', ['tenant_id', 'customer_code'], {
      unique: true,
      name: 'idx_customers_tenant_code'
    });
    
    await queryInterface.addIndex('customers', ['tenant_id', 'is_active'], {
      name: 'idx_customers_tenant_active'
    });
    
    await queryInterface.addIndex('customers', ['name'], {
      name: 'idx_customers_name'
    });
    
    await queryInterface.addIndex('customers', ['contact_email'], {
      name: 'idx_customers_contact_email'
    });

    // Add check constraints
    await queryInterface.addConstraint('customers', {
      fields: ['name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '<=', 255)
        ]
      },
      name: 'chk_customers_name_length'
    });

    await queryInterface.addConstraint('customers', {
      fields: ['customer_code'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('customer_code')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('customer_code')), '<=', 50)
        ]
      },
      name: 'chk_customers_code_length'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  }
};
