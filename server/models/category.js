var mongoose = require('mongoose');
var Schema = mongoose.Schema;


let categorySchema = new Schema({
    description: { type: String, unique: true, required: [true, 'The description is requiered'] },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Category', categorySchema);