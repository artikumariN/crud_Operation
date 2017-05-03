var app  =  angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http){

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
