const mongoose = require('mongoose');
const config = require('config');
module.exports = function () {
    const db = "mongodb+srv://dhiaeddinetrabelsi:bEyGfevTyZfRP7nz@car-rental-manager.vfpld.mongodb.net/?retryWrites=true&w=majority&appName=car-rental-manager";
    mongoose.connect(db,
        {
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true
        }
    )
        .then(() => console.log(`Connecting to ${db}...`))
        .catch((ex) => console.log('Database Error...' + ex + ' db: ' + db));
}