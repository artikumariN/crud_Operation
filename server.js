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
app.use(express.static(path.join(__dirname, 'uploads')));

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

app.get('/findUserData/:id',function(req,res){
  model.find({'_id':req.params.id},function(err,data){
    res.send(data);
  });
});

//Adding More records using input boxes
app.post('/add',upload.single('imagefile'),function(req,res){
  req.params.name=req.body.name;
  req.params.title=req.body.title;
  req.params.company_name=req.body.company_name;
  req.params.about_me=req.body.about_me;
  req.params.email=req.body.email;
  req.params.cell=req.body.cell;
  req.params.address=req.body.address;
  req.params.phone=req.body.phone;
  req.params.image=req.file.filename;
    console.log(req.params);
      var data      = req.params,
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

app.post('/update',upload.single('image'),function(req,res){
  console.log(req.file.filename);
  var id=req.body.id;
  req.params.name=req.body.name;
  req.params.title=req.body.title;
  req.params.company_name=req.body.company_name;
  req.params.about_me=req.body.about_me;
  req.params.email=req.body.email;
  req.params.cell=req.body.cell;
  req.params.address=req.body.address;
  req.params.image=req.file.filename;

    model.findByIdAndUpdate(id,req.params ,
    function(err) {
     if (err) {
       res.send("error");
     }
        res.sendFile(userpath+"/index.html");
     });

});
app.listen('8080',function(){
  console.log("Your app is listening on 8080 port!");
});
