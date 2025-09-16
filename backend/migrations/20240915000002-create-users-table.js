'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
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
      supabase_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        unique: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'manager', 'operator', 'viewer'),
        allowNull: false,
        defaultValue: 'operator'
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      last_login_at: {
        type: Sequelize.DATE,
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
    await queryInterface.addIndex('users', ['tenant_id'], {
      name: 'idx_users_tenant_id'
    });
    
    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'idx_users_email'
    });
    
    await queryInterface.addIndex('users', ['supabase_user_id'], {
      unique: true,
      name: 'idx_users_supabase_user_id'
    });
    
    await queryInterface.addIndex('users', ['tenant_id', 'is_active'], {
      name: 'idx_users_tenant_active'
    });
    
    await queryInterface.addIndex('users', ['role'], {
      name: 'idx_users_role'
    });

    // Add check constraints
    await queryInterface.addConstraint('users', {
      fields: ['first_name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('first_name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('first_name')), '<=', 100)
        ]
      },
      name: 'chk_users_first_name_length'
    });

    await queryInterface.addConstraint('users', {
      fields: ['last_name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('last_name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('last_name')), '<=', 100)
        ]
      },
      name: 'chk_users_last_name_length'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
