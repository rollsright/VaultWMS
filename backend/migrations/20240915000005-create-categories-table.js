'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
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
      category_code: {
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
      parent_category_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      path: {
        type: Sequelize.STRING(500),
        allowNull: true
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
    await queryInterface.addIndex('categories', ['tenant_id'], {
      name: 'idx_categories_tenant_id'
    });
    
    await queryInterface.addIndex('categories', ['tenant_id', 'category_code'], {
      unique: true,
      name: 'idx_categories_tenant_code'
    });
    
    await queryInterface.addIndex('categories', ['tenant_id', 'is_active'], {
      name: 'idx_categories_tenant_active'
    });
    
    await queryInterface.addIndex('categories', ['parent_category_id'], {
      name: 'idx_categories_parent'
    });
    
    await queryInterface.addIndex('categories', ['level'], {
      name: 'idx_categories_level'
    });
    
    await queryInterface.addIndex('categories', ['path'], {
      name: 'idx_categories_path'
    });

    // Add check constraints
    await queryInterface.addConstraint('categories', {
      fields: ['name'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('name')), '<=', 255)
        ]
      },
      name: 'chk_categories_name_length'
    });

    await queryInterface.addConstraint('categories', {
      fields: ['category_code'],
      type: 'check',
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('category_code')), '>=', 1),
          Sequelize.where(Sequelize.fn('LENGTH', Sequelize.col('category_code')), '<=', 50)
        ]
      },
      name: 'chk_categories_code_length'
    });

    await queryInterface.addConstraint('categories', {
      fields: ['level'],
      type: 'check',
      where: {
        level: {
          [Sequelize.Op.gte]: 1
        }
      },
      name: 'chk_categories_level_positive'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  }
};
