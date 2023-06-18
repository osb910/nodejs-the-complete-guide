import mongoose from 'mongoose';
const {connect} = mongoose;

let _db;
const mongoUri = `mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.l774dlz.mongodb.net/shop?retryWrites=true&w=majority`;

const mongoConnect = async () => {
  try {
    const client = await connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true,
    });

    // _db = client.db();
    console.log('Connected to MongoDB');
    // return client;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const getDb = () => {
  if (_db) return _db;
  throw 'No database found!';
};

export {
  mongoUri,
  mongoConnect,
  getDb,
};
