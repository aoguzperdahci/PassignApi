const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false");

module.exports = async function (context, req) {
    try {
        const auth = req.headers.authorization;
        await client.connect();
        const result = await client.db("Passign").collection("Passwords").insertOne({authorization: auth, passwords: [ ] });
        if (result.acknowledged != true) {
            throw result;
        }
        context.res = {
            body: result.insertedId,
            status: 200
        }
    } catch (error) {
        context.res = {
            status: 401
        }
    }finally {
        client.close();
    }
}