const Joi = require("joi");
const { validateRequestBody } = require("../utils/utilityFunctions.js");
const CustomAPIError = require("../errors/custom-api.js");
const Admin = require("../models/admin.js");

const Params = {
  createAdmin: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const createAdmin = async (req, res) => {
  const validated_data = validateRequestBody(Params.createAdmin, req.body);

  const admin = await Admin.create(validated_data);
  return res.json({ admin });
};


module.exports = {createAdmin}