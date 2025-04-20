const { BadRequestError } = require("../errors");
const Counter = require("../models/counter.js");

const validateRequestBody = (schema, requestBody) => {
  const { error } = schema.validate(requestBody, { allowUnknown: false });
  if (error) {
    throw new BadRequestError(error);
  }

  return requestBody;
};

async function getNextSequenceValue() {
  const sequenceDocument = await Counter.findOneAndUpdate(
    {},
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.seq;
}

function makeRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

module.exports = {
  validateRequestBody,
  getNextSequenceValue,
  makeRandomString,
};
