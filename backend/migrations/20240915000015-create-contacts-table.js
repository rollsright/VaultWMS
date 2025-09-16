'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contacts', {
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
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      notes: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex('contacts', ['customer_id'], {
      name: 'idx_contacts_customer_id'
    });
    
    await queryInterface.addIndex('contacts', ['customer_id', 'is_primary'], {
      name: 'idx_contacts_customer_primary'
    });
    
    await queryInterface.addIndex('contacts', ['email'], {
      name: 'idx_contacts_email'
    });
    
    await queryInterface.addIndex('contacts', ['customer_id', 'status'], {
      name: 'idx_contacts_customer_status'
    });
    
    await queryInterface.addIndex('contacts', ['first_name', 'last_name'], {
      name: 'idx_contacts_name'
    });

    // Add check constraints
    await queryInterface.addConstraint('contacts', {
      fields: ['first_name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('first_name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('first_name')), '<=', 100)
        ]
      },
      name: 'chk_contacts_first_name_length'
    });

    await queryInterface.addConstraint('contacts', {
      fields: ['last_name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('last_name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('last_name')), '<=', 100)
        ]
      },
      name: 'chk_contacts_last_name_length'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contacts');
  }
};
