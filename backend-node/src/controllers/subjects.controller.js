const content = require('../data/content');

exports.list = async (req, res) => {
  res.json([{ id: content.SUBJECT.id, name: content.SUBJECT.name, material: content.SUBJECT.material }]);
};
