var app  =  angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http){

//Image Display
$scope.stepsModel = [];

$scope.imageUploadData = function(event){
    $scope.stepsModel="";
     var files = event.target.files; //FileList object
     for (var i = 0; i < files.length; i++) {
         var file = files[i];
             var reader = new FileReader();
             reader.onload = $scope.imageIsLoaded;
             reader.readAsDataURL(file);
     }
}

$scope.imageIsLoaded = function(e){
    $scope.$apply(function() {
        $scope.stepsModel.push(e.target.result);
    });
}

//fetch data from form
    $scope.findData = function() {
      var onSuccess = function(response){
        $scope.userdata=response.data;
      };

      var onFailure =function(){
      };

      $http({
          method: 'GET',
          url: '/findData'
        }).then(onSuccess,onFailure);

    }
    $scope.findData();

//find User Data
  $scope.findUser=function(id)
  {
    $http({
        method: 'GET',
        url: '/findUserData/'+id,
      }).then(function successCallback(response) {
          $scope.viewData=response.data;
        }, function errorCallback(response) {
              console.log(response);
        });
  }
//Remove Data from form
    $scope.removeData = function(id)
    {
      $http({
          method: 'GET',
          url: '/deleteData/'+id,
        }).then(function successCallback(response) {
              if(response="removed")
              {
                  $scope.findData();
              }
          }, function errorCallback(response) {
                console.log(response);
          });
    }

//Export data in excel format
    $scope.exportData = function()
    {
      $http({
          method: 'GET',
          url: '/exportExcel',
        }).then(function successCallback(response) {
              swal("File is exported in Home Directiory  as file Name "+JSON.stringify(response.data.fileName));
          }, function errorCallback(response) {
                console.log(response);
          });
    }

});
