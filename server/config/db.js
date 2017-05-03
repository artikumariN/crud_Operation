var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/excelRecord',function(err,data){
      if(err)
      {
        console.log("Some err");
      }
      else {
        console.log("Connection establish");
      }
    });
