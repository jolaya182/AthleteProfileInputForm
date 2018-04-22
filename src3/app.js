"use strict"
// var myApp = angular.module('myApp', []);
angular.module('formApp', ['ngAnimate']).
  service("uploadService", function ($http, $q) {
    console.log(" inside upload service");
    return ({
      upload: upload
    });

    function upload(file) {
      console.log("gather file", file);
      var upl = $http({
        method: 'POST',
        url: 'http://localhost:3001/post/profilePic', // /api/upload
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: {
          upload: file
        },
        transformRequest: function (data, headersGetter) {
          var formData = new FormData();
          angular.forEach(data, function (value, key) {
            formData.append(key, value);
          });

          var headers = headersGetter();
          delete headers['Content-Type'];

          return formData;
        }
      });
      return upl.then(handleSuccess, handleError);

    } // End upload function

    // ---
    // PRIVATE METHODS.
    // ---

    function handleError(response, data) {
      if (!angular.isObject(response.data) || !response.data.message) {
        return ($q.reject("An unknown error occurred."));
      }

      return ($q.reject(response.data.message));
    }

    function handleSuccess(response) {
      return (response);
    }

  }).directive("ngFiles", ['$parse', function ( $parse) {

    function fn_link(scope, element, attrs) {
      var onChange = $parse(attrs.ngFiles);
      element.on('change', function (event) {
        let file = event.target.files[0];
       
          const name = new Date().getTime() + event.target.files[0].name;// Concat with file extension.
          
          // Instantiate copy of file, giving it new name.
         let newFile = new File([file], name, { type: file.type });
        console.log("newFile:", newFile);
        let newA = {'0': newFile};
        // event.target.files[0].name = new Date().getMilliseconds() + even.target.files[0].name;
        console.log( "newA: ", newA);
        console.log("event.target.files", event.target.files);
        onChange(scope, { $files: newA });
      });
    };

    return {
      link: fn_link
    }
  }]).
  controller('formCtrl', ['$scope', '$http', 'uploadService', function ($scope, $http, uploadService) {

    var formdata = new FormData($scope.formApp);
    $scope.getTheFiles = function ($files) {
      console.log("$files has changed :", $files[0].name);
      $scope.formParams.ProfileImage = $files[0].name;
      console.log("FormsParams.profile is currently: ",  $scope.formParams.ProfileImage);
      angular.forEach($files, function (value, key) {
        formdata.append(key, value);
      });
    };

    // NOW UPLOAD THE FILES.
    $scope.uploadFiles = function () {
      // SEND THE FILES.
   

      // formdata.name = new Date().getMilliseconds() + formdata.name ;
      console.log("the form data is,", formdata);
      $http({
        method: 'POST',
        url: "http://localhost:3001/post/profilePic",
        data: formdata,
        headers: { 'Content-Type': undefined }
      }).then(function successCallback(d) {
        console.log(d);
      }, function errorCallback(error) {
        console.log(error);
      });

    }



    $scope.formParams = {};
    $scope.stage = "";
    $scope.listOfProfiles = "";
    $scope.listOfProfilesImages = "";
    $scope.listOfProfilesImagesShow = false;
    $scope.formValidation = false;
    $scope.toggleJSONView = false;
    $scope.toggleFormErrorsView = false;

    // let flName = $scope.file;
    $scope.formParams = {
      // ccEmail: '',
      // ccEmailList: [],
      FirstName: "",
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
      ProfileImage: "pic"
    };

    $scope.gender = ["male", "female"];
    $scope.answer = ["YES", "NO"];
    $scope.bool = {
      "YES": true,
      "NO": false
    }
    $scope.allSports = [];
    populateSports();

    function populateSports() {
      let getSports = "http://localhost:3001/get/sports";
      $http({
        method: "GET",
        url: getSports
      }).then(function successCallback(response) {
        if (response
          && response.data
          && response.status === 200) {
          $scope.allSports = response.data;
          console.log("response populate sports:", response, "scope.allSports", $scope.allSports);
          return response;
        }
      }, function errorCallback(response) {
        $scope.allSports = "error";
        console.log("error response", response);
        return response;
      });
    }

    $scope.next = function (stage) {
      $scope.formValidation = true;
      // console.log("multiStepForm:",$scope.multiStepForm)
      if ($scope.multiStepForm.$valid) {
        $scope.direction = 1;
        $scope.stage = stage;
        $scope.formValidation = false;
      }
    };
    $scope.back = function (stage) {
      $scope.direction = 0;
      $scope.stage = stage;
    };

    $scope.addCCEmail = function () {
      $scope.rowId++;
      console.log("ccEmail", $scope.formParams.ccEmail, "rowId", $scope.rowId)
      let email = {
        email: $scope.formParams.ccEmail,
        row_id: $scope.rowId
      };
      // console.log( "email",email);
      // console.log( "ccEmailList",$scope.formParams.ccEmailList);
      $scope.formParams.ccEmailList.push(email);
      $scope.formParams.ccEmail = '';
    };

    $scope.removeCCEmail = function (row_id) {

      for (let i = 0; i < $scope.formParams.ccEmailList.length; i++) {
        if ($scope.formParams.ccEmailList[i].row_id === row_id) {
          $scope.formParams.ccEmailList.splice(i, 1);
          $scope.rowId--;
          break;
        }
      }
    };

    $scope.submitForm = function () {
      //submitPicture();
      $scope.uploadFiles();
      console.log("$scope.filepreview", $scope.filepreview);

      let wsUrl = "http://localhost:3001";
      if ($scope.multiStepForm.$valid) {
        $scope.formValidation = false;
        // $scope.formParams.ProfileImage = $scope.file;
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
        }, function errorCallback(response) {
          $scope.stage = "error";
          console.log("response", response);
        });
      }
    };



    function getProfiles() {
      //http request
      let urlAthlete = "http://localhost:3001/profiles";

      $http({
        method: "GET",
        url: urlAthlete,
      }).then(function successCallback(response) {
        if (response
          && response.data
          && response.status === 200) {
          $scope.stage = "success";
          let d = response.data;
          let obj = {};
          $scope.listOfProfiles = response.data;
          for (let index = 0; index < d.length; index++) {
            obj[d[index].imgName] = [d[index].name];
          }
          console.log("obj profiles", obj);
          console.log("response athlete:", response, "scope.stage", $scope.stage);
          let p = new Promise(function (resolve, reject) {

            $http({ method: "GET", url: "http://localhost:3001/get/profilePics" })
              .then(function (d) {
                if (response
                  && response.data
                  && response.status === 200) {
                  $scope.listOfProfilesImages = d.data.data;
                  let data = d.data.data;
                  console.log("response athlete data pics:", data);
                  for (let i = 0; i< data.length; i++) {
                    // console.log("obj[data[i].Key]", obj[data[i].Key]);
                    obj[data[i].Key].push( data[i].url);
                    // console.log("i:", i, " data[i]:", data[i], "obj[data[i].Key]", obj[data[i].Key])
                  }
                  console.log("obj means it has", obj);
                  $scope.listOfProfilesImages = obj;
                  resolve(obj)
                }
                reject("response did go well in line 220")
              }, function (errorResponse) { console.log("errorResponse", errorResponse) })
          });
          p.then(function (data) {$scope.listOfProfilesImagesShow = true; console.log("data is added", data) }).catch(function (err) { console.log("err on the promise", err) });
          return response;
        }
      }, function errorCallback(response) {
        $scope.stage = "error";
        console.log("response", response);
        return response;
      });



    }

    $scope.reset = function () {
      $scope.formParams = {};
      $scope.stage = "";
    }

    function sendPicture() {
      console.log("sent Picture");
    }

    function retrievePicture(etag) {
      console.log("retrieved Picture");
    }

  }])