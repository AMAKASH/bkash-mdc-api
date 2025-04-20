const notFound = (req, res) =>
  res.status(404).json({ msg: "Route Not found", error: true });

module.exports = notFound;
