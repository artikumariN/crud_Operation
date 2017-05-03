var mongoose    = require('mongoose');
    Schema      = mongoose.Schema;
    ObjectId    = mongoose.Schema.ObjectId;

var employeeRecord=new Schema({
      _id       : {type:ObjectId,auto:true},
      name      : {type:String},
      phone     : {type:String},

    }, {
     versionKey: false
    });

var employeeRecord = mongoose.model('userRecord', employeeRecord);

module.exports = employeeRecord;
