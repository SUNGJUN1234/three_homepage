const exampleModel = require('../models/exampleModel');

const getExamples = async (req, res) => {
  try {
    const examples = await exampleModel.getExamples();
    res.json(examples);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExample = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await exampleModel.createExample(name);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExamples,
  createExample,
};
