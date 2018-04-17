"use strict"

angular.module('formApp', ['ngAnimate']).
controller('formCtrl',['$scope', '$http', function($scope,$http){
  $scope.formParams = {};
  $scope.stage = "";
  $scope.listOfProfiles = "";
  $scope.formValidation = false;
  $scope.toggleJSONView = false;
  $scope.toggleFormErrorsView = false;

  $scope.formParams = {
    ccEmail: '',
    ccEmailList: [],
    FirstName:"",
    LastName: "", 
    DateOfBirth: "",
    Nationality: "",
    Location: "",
    Association: "",
    Team: "",
    Gender: "",
    Sports: "", 
    About: "",
    Interests: "",
    Charities: "",
    SocialMediaHandles: "",
    Pets: "",
    DrinksAlcohol: "",
    Married: "",
    ProfileImage: ""
  };

  $scope.gender = [ "male", "female"];
  $scope.answer = [ "YES", "NO" ];
  $scope.bool = {
    "YES": true,
    "NO": false
  }
  $scope.allSports = [];
  populateSports();

  function populateSports (){
    let getSports = "http://localhost:3001/get/sports";
    $http({
      method: "GET",
      url: getSports
    }).then(function successCallback(response){
      if (response
        && response.data
        && response.status === 200) {
        $scope.allSports = response.data;
        console.log("response populate sports:",response, "scope.allSports",$scope.allSports );
        return response;
      }
    }, function errorCallback(response) {
      $scope.allSports = "error";
      console.log("error response", response);
      return response;
    });
  }

  $scope.next = function(stage){
    $scope.formValidation = true;
    // console.log("multiStepForm:",$scope.multiStepForm)
    if($scope.multiStepForm.$valid){
      $scope.direction = 1;
      $scope.stage = stage;
      $scope.formValidation = false;
    }
  };
  $scope.back = function(stage){
    $scope.direction = 0;
    $scope.stage = stage;
  };

  $scope.addCCEmail = function(){
    $scope.rowId++;
    console.log( "ccEmail", $scope.formParams.ccEmail,  "rowId", $scope.rowId)
    let email = {
      email: $scope.formParams.ccEmail,
      row_id: $scope.rowId
    };
    // console.log( "email",email);
    // console.log( "ccEmailList",$scope.formParams.ccEmailList);
    $scope.formParams.ccEmailList.push(email);
    $scope.formParams.ccEmail = '';
  };

  $scope.removeCCEmail = function(row_id){

    for (let i = 0; i < $scope.formParams.ccEmailList.length; i++) {
      if($scope.formParams.ccEmailList[i].row_id === row_id){
        $scope.formParams.ccEmailList.splice(i, 1);
        $scope.rowId--;
        break;
      }
    }
  };

  $scope.submitForm = function(){
    let wsUrl = "http://localhost:3001";
    if($scope.multiStepForm.$valid){
      $scope.formValidation = false;

      $http({
        method: 'POST',
        url: wsUrl,
        data: JSON.stringify($scope.formParams)
      }).then(function successCallback(response) {
        // console.log("1response:",response, "scope.stage",$scope.stage );
        if (response
          && response.data
          && response.status === 200) {
          $scope.stage = "success";
          // console.log("2response:",response, "scope.stage",$scope.stage );
          $scope.listOfProfiles = getProfiles();
        } else {
          if (response
            && response.data
            && response.data.status
            && response.data.status === 'error') {
            $scope.stage = "error";
          }
        }
      }, function errorCallback(response){
        $scope.stage = "error";
        console.log("response", response);
      });
    }
  };
  
  function getProfiles(){
    //http request
    let urlAthlete = "http://localhost:3001/profiles";

    $http({
      method: "GET",
      url:urlAthlete,
    }).then(function successCallback(response){
    if (response
          && response.data
          && response.status === 200) {
          $scope.stage = "success";
          $scope.listOfProfiles = response.data;
          console.log("response athlete:",response, "scope.stage",$scope.stage );
          return response;
        }
    },function errorCallback(response){
      $scope.stage = "error";
      console.log("response", response);
      return response;
    });

   

  }

  $scope.reset = function(){
    $scope.formParams = {};
    $scope.stage = "";
  }


}] )