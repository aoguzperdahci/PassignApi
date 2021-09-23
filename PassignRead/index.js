const { MongoClient } = require('mongodb');
const { ObjectID } = require('bson');
const client = new MongoClient("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false");

module.exports = async function (context, req) {
    try {
        const auth = req.headers.authorization;
        const id = req.headers.id;
        if (id.length != 24) {
            throw id;
        }
        await client.connect();
        const result = await client.db("Passign").collection("Passwords").findOne( { _id: ObjectID.createFromHexString(id) } );
        if (result.authorization != auth){
            throw auth;
        }
        context.res = {
            body: result.passwords,
            status: 200
        }
    } catch (error) {
        context.res = {
            status:401
        }
    }finally {
        client.close();
    }
}