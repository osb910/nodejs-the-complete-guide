const {MongoClient} = require('mongodb');

let _db;

const mongoUri = `mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.l774dlz.mongodb.net/?retryWrites=true&w=majority`;

const mongoConnect = async () => {
  try {
    const client = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    _db = client.db();
    console.log('Connected to MongoDB');
    // return client;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getDb = () => {
  if (_db) return _db;
  throw 'No database found!';
};

const insertOne = async (collection, document) => {
  try {
    const result = await _db.collection(collection).insertOne(document, {
      writeConcern: {
        w: 1,
        j: true,
        wtimeout: 3141
      }
    });
    console.log(`Document ${result.acknowledged
        ? `#${result.insertedId} inserted into [${collection}] collection!`
        : `insertion into [${collection}] collection failed!`}`
    );
    return result;
  } catch (err) {
    console.error(err);
  }
};

const insertMany = async (collection, documents) => {
  try {
    const result = await _db.collection(collection).insertMany(documents, {
      ordered: false,
      writeConcern: {w: 1, j: true}
    });
    console.log({result});
    return result;
  } catch (err) {
    console.error(err);
  }
};

const findOne = async (collection, filter = {}, projection = {}) => {
  try {
    const document = await _db.collection(collection).findOne(filter, {projection});
    document &&
    console.log(
        `Fetched from [${collection}] collection:`,
        JSON.stringify(document, ['_id', 'name', 'title'], 2)
    );
    return document;
  } catch (err) {
    console.error(err);
  }
};

const findMany = async (collection, filter = {},
                        {projection = {}, pgNum = 1, resultsPerPage = 10, sort = {}} = {}
) => {
  try {
    const pastResults = (pgNum - 1) * resultsPerPage;

    let cursor = await _db.collection(collection)
        .find(filter, {projection, sort});
    // const count = await cursor.countDocuments({ "_id": { "$exists": true } });
    const count = await cursor.count();

    if (pgNum > 1) {
      cursor = await cursor.skip(pastResults);
    }

    const documents = cursor.limit(resultsPerPage).toArray();

    console.log(`${count > 0 ? count : 'No'} documents found in [${collection}] collection!`);
    return documents;
  } catch (err) {
    console.error(err);
  }
};

const updateOne = async (collection, filter, update, {upsert = false, arrayFilters = []} = {}) => {
  try {
    const result = await _db.collection(collection).updateOne(filter, update, {upsert, arrayFilters});
    console.log(
        `Document ${JSON.stringify(filter)} in [${collection}] collection update${
            result.acknowledged && result.modifiedCount ? `d!` : ` failed!`
        }`
    );
    return result;
  } catch (err) {
    console.error(err);
  }
};

const updateMany = async (collection, filter, update, upsert = false, arrayFilters = []) => {
  try {
    const result = await _db.collection(collection).updateMany(filter, update, {upsert, arrayFilters});
    console.log(
        `Documents ${JSON.stringify(filter)} in [${collection}] collection update${
            result.acknowledged && result.modifiedCount ? `d!` : ` failed!`
        }
        ${result.modifiedCount} document(s) modified.`
    );
    return result;
  } catch (err) {
    console.error(err);
  }
}

const deleteOne = async (collection, filter) => {
  try {
    const result = await _db.collection(collection).deleteOne(filter);
    console.log(
      `Document ${JSON.stringify(filter)} in [${collection}] collection delete${
        result.acknowledged ? `d!` : ` failed!`
      }`
    );
    return result;
  } catch (err) {
    console.error(err);
  }
};

const deleteMany = async (collection, filter) => {
  try {
    const result = await _db.collection(collection).deleteMany(filter);
    console.log(
        `Documents ${JSON.stringify(filter)} in [${collection}] collection delete${
            result.acknowledged ? `d!` : ` failed!`
        }
        ${result.deletedCount} document(s) deleted.`
    );
    return result;
  } catch (err) {
    console.error(err);
  }
};

const dropCollection = async collection => {
  try {
      const result = await _db.collection(collection).drop();
      console.log(`Collection [${collection}] dropped!`);
      return result;
  } catch (err) {
      console.error(err);
  }
};

const dropDatabase = async () => {
  try {
      const result = await _db.dropDatabase();
      console.log(`Database dropped!`);
      return result;
  } catch (err) {
      console.error(err);
  }
}

module.exports = {
  mongoConnect,
  getDb,
  insertOne,
  insertMany,
  findOne,
  findMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
  dropCollection,
  dropDatabase,
};
