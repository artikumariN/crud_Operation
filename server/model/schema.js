var mongoose    = require('mongoose');
    Schema      = mongoose.Schema;
    ObjectId    = mongoose.Schema.ObjectId;

var employeeRecord=new Schema({
      _id                : {type:ObjectId,auto:true},
      name               : {type:String},
      title              : {type:String},
      company_name       : {type:String},
      about_me           : {type:String},
      email              : {type:String},
      cell               : {type:String},
      address            : {type:String},
      phone              : {type:String},
      image              : {type:String},

    }, {
     versionKey: false
    });

var employeeRecord = mongoose.model('userRecord', employeeRecord);

module.exports = employeeRecord;
