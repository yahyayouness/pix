const buildKnowledgeElements = require('./build-smart-placement-knowledge-element');
const databaseBuffer = require('../database-buffer');

module.exports = function buildProfileV2({
  knowledgeElements = buildKnowledgeElements(),
} = {}) {

  const values = {
    knowledgeElements,
  };

  databaseBuffer.pushInsertable({
    tableName: 'profileV2',
    values,
  });

  return values;
};
