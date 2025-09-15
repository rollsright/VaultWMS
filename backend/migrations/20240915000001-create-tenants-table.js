'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tenants', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
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
      address: {
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
    await queryInterface.addIndex('tenants', ['slug'], {
      unique: true,
      name: 'idx_tenants_slug'
    });
    
    await queryInterface.addIndex('tenants', ['is_active'], {
      name: 'idx_tenants_is_active'
    });
    
    await queryInterface.addIndex('tenants', ['contact_email'], {
      name: 'idx_tenants_contact_email'
    });
    
    await queryInterface.addIndex('tenants', ['created_at'], {
      name: 'idx_tenants_created_at'
    });

    // Add check constraints
    await queryInterface.addConstraint('tenants', {
      fields: ['name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '>=', 2),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '<=', 255)
        ]
      },
      name: 'chk_tenants_name_length'
    });

    await queryInterface.addConstraint('tenants', {
      fields: ['slug'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('slug')), '>=', 2),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('slug')), '<=', 100),
          Sequelize.where(Sequelize.col('slug'), '~', '^[a-z0-9-]+$')
        ]
      },
      name: 'chk_tenants_slug_format'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tenants');
  }
};
