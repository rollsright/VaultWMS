'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carriers', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(50),
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
      service_types: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      tracking_url: {
        type: Sequelize.STRING(500),
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
    await queryInterface.addIndex('carriers', ['tenant_id'], {
      name: 'idx_carriers_tenant_id'
    });
    
    await queryInterface.addIndex('carriers', ['tenant_id', 'code'], {
      unique: true,
      name: 'idx_carriers_tenant_code'
    });
    
    await queryInterface.addIndex('carriers', ['tenant_id', 'status'], {
      name: 'idx_carriers_tenant_status'
    });
    
    await queryInterface.addIndex('carriers', ['name'], {
      name: 'idx_carriers_name'
    });
    
    await queryInterface.addIndex('carriers', ['code'], {
      name: 'idx_carriers_code'
    });

    // Add check constraints
    await queryInterface.addConstraint('carriers', {
      fields: ['name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '<=', 255)
        ]
      },
      name: 'chk_carriers_name_length'
    });

    await queryInterface.addConstraint('carriers', {
      fields: ['code'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('code')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('code')), '<=', 50)
        ]
      },
      name: 'chk_carriers_code_length'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('carriers');
  }
};
