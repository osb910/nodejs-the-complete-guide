import mongoose from 'mongoose';
const {connect} = mongoose;

const mongoUri = `mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.l774dlz.mongodb.net/blog?retryWrites=true&w=majority`;
const mongoConnect = async () => {
  try {
    const client = await connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const listDbCollections = async (dbName) => {
  try {
    const DB = mongoose.connection.useDb(dbName);
    return (await DB.db.listCollections().toArray()).map(({name}) => name);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const getDbCollections = async (dbName) => {
  try {
    const DB = mongoose.connection.useDb(dbName);
    return await DB.db.collections();
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

export {
  mongoUri,
  mongoConnect,
  listDbCollections,
  getDbCollections,
};
