import * as Realm from 'realm-web';

const REALM_APP_ID = process.env.REACT_APP_REALM_APP_ID;
export const app = new Realm.App({ id: REALM_APP_ID });
export const credentials = Realm.Credentials.anonymous()

// const mongo = app.currentUser.mongoClient(process.env.REACT_APP_MONGODB_URL);
// export const collection = mongo.db(process.env.REACT_APP_DB_NAME).collection("proposals");


