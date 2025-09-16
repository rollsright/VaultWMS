'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('suppliers', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      contact_person: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      payment_terms: {
        type: Sequelize.STRING(100),
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
    await queryInterface.addIndex('suppliers', ['tenant_id'], {
      name: 'idx_suppliers_tenant_id'
    });
    
    await queryInterface.addIndex('suppliers', ['customer_id'], {
      name: 'idx_suppliers_customer_id'
    });
    
    await queryInterface.addIndex('suppliers', ['tenant_id', 'status'], {
      name: 'idx_suppliers_tenant_status'
    });
    
    await queryInterface.addIndex('suppliers', ['email'], {
      name: 'idx_suppliers_email'
    });
    
    await queryInterface.addIndex('suppliers', ['name'], {
      name: 'idx_suppliers_name'
    });

    // Add check constraints
    await queryInterface.addConstraint('suppliers', {
      fields: ['name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '<=', 255)
        ]
      },
      name: 'chk_suppliers_name_length'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('suppliers');
  }
};
