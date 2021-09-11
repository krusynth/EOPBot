'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'documents',
      'posted',
      Sequelize.DATEONLY
    );

    await queryInterface.addIndex('documents',
      { fields: ['posted'], name: 'documents_posted' });

    await queryInterface.addIndex('documents',
      { fields: ['type'], name: 'documents_type' });

    await queryInterface.addIndex('documents',
      { fields: ['url'], name: 'documents_url' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('documents', 'documents_url');

    await queryInterface.removeIndex('documents', 'documents_type');

    await queryInterface.removeIndex('documents', 'documents_posted');

    await queryInterface.removeColumn(
      'documents',
      'posted'
    );
  }
};
