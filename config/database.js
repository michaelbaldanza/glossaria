const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost${db_name}', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});