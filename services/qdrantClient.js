const { QdrantClient } = require('@qdrant/qdrant-js'); // use correct package

const client = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
});

async function initCollection() {
  const name = 'documents';
  const existing = await client.getCollections();
  if (!existing.collections.find(c => c.name === name)) {
    await client.createCollection(name, {
      vectors: { size: 1536, distance: 'Cosine', on_disk: true },
    });
    console.log('✅ Qdrant collection created');
  }
}
initCollection();

async function upsertToQdrant({ id, vector, payload }) {
  await client.upsert('documents', [{ id, vector, payload }]);
}

async function queryByFileId(fileId) {
  const result = await client.scroll('documents', {
    limit: 100,
    filter: {
      must: [{ key: 'fileId', match: { value: fileId } }],
    },
  });
  return result.points || [];
}

module.exports = { upsertToQdrant, queryByFileId };
