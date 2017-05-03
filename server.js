var express         =   require('express'),
    app             =   express(),
    mongoose        =   require('mongoose'),
    path            =   require('path'),
    connection      =   require('./server/config/db'),
    bodyParser      =   require('body-parser'),
    mongoXlsx       =   require('mongo-xlsx'),
    fs              =   require('fs'),
    model           =   require('./server/model/schema'),
    multer          =   require('multer'),
    connect         =   require('connect'),
    userpath        =   path.join(__dirname, 'app/view'),
    crypto          =   require('crypto'),
    mime            =   require('mime'),
    async           =   require('async');
    //upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(2, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
var upload = multer({ storage: storage });

//Index Page loading
app.get('/',function(req,res){
    res.sendFile(userpath+"/index.html");
});


//Api of find all data
app.get('/findData',function(req,res){
  model.find({},function(err,data){
    res.send(data);
  });
});

//Adding More records using input boxes
app.post('/add',function(req,res){
  var data          = req.body,
      saveRecord    = new model(data);
      saveRecord.save(function(err,data){
        if(err)
        {
          console.log("something error data not saved properly");
        }
        else {

              res.sendFile(userpath+"/index.html");
          }
      })
});


//api of delete data
app.get('/deleteData/:id',function(req,res){
    model.remove({'_id':req.params.id},function(err,succ){
      if(err)
      {
          console.log("error");
      }
      else {
        res.send("removed");
      }

    });
});

//Export excel sheet api
app.get('/exportExcel',function(req,res){
  model.find({},function(err,data){
      var model = mongoXlsx.buildDynamicModel(data);
    mongoXlsx.mongoData2Xlsx(data, model, function(err, data) {
      console.log('File saved at:', data);
      res.send(data);
    });

  });
});


//Add multiple records at a time using xml file
app.post('/uploads', upload.single('file'), function(req,res){
  var model1 = null;
  mongoXlsx.xlsx2MongoData(req.file.path, model1, function(err, mongoData) {
  var xslData    = mongoData;

  async.each(xslData, function(xslData, asyncdone) {
              var saveRecord    = new model(xslData);
              saveRecord.save(function(err,data){
              if(err)
              {
                console.log("something error data not saved properly");
              }

              res.sendFile(userpath+"/index.html");
            });
      }, function(err) {
        if (err) return console.log(err);
        done();
      });
  });

});

//created  port no
app.listen('8080',function(){
  console.log("Your app is listening on 8080 port!");
});
