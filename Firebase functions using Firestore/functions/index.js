const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({origin: true}));

app.post("/", async (req, res) => {
  const record = {
    authorization: req.headers.authorization,
    records: [],
  };
  const snapshot = await db.collection("records").add(record);
  res.status(200).send(snapshot.id);
});

app.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("records").doc(req.headers.id).get();
    const data = snapshot.data();
    if (data.authorization === req.headers.authorization) {
      res.status(200).send(JSON.stringify(data.records));
    } else {
      throw req;
    }
  } catch (error) {
    res.status(403).send(JSON.stringify(error));
  }
});

app.put("/", async (req, res) => {
  try {
    const id = req.headers.id;
    const records = req.body.records;
    const snapshot = await db.collection("records").doc(id).get();
    const data = snapshot.data();
    if (data.authorization === req.headers.authorization) {
      const writeResult = await db.collection("records").doc(id)
          .update({records: records});
      writeResult._writeTime ? res.status(200).send() : res.status(500).send();
    } else {
      throw req;
    }
  } catch (error) {
    res.status(403).send(JSON.stringify(error));
  }
});

exports.passign = functions.region("europe-west1").runWith({maxInstances: 1, memory: 128, timeoutSeconds: 30}).https.onRequest(app);
