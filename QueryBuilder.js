
var getField = "";
var forField = "";
var tableLink = "";

document.getElementById('mainTable').style.visibility = 'collapse';
document.getElementById('expandTable').style.visibility = 'collapse';

var app = angular.module("MetricsAPI",[]);

  app.controller("titles", function($scope,$http,$q) {
    $scope.datasetsInfo = [];
    $scope.variables;
    $scope.geographies;
    $scope.datetime; 
    $scope.hastime = false;
    $scope.getField = "";
    $scope.forField = "";
    $scope.timeField = "";

    $scope.loadDiscovery = function() { 

      document.getElementById('mainTable').style.visibility = 'visible';
      document.getElementById('expandTable').style.visibility = 'collapse';

      var url = document.getElementById("selection");
      var urlSel = url.options[url.selectedIndex].value;
      $scope.datasetsInfo = [];

      $http.get(urlSel + '.json')
        .then(function(response){
          for(i=0;i<response.data.dataset.length;i++){

            $scope.datasetsInfo.push(
                {title : response.data.dataset[i].title, 
                description : response.data.dataset[i].description,
                varLink : response.data.dataset[i].c_variablesLink.replace("/variables.json",'')
            });

          };
        
        });
    };


    $scope.loadOptionsList = function(urLink,urLinkTtl) {
      document.getElementById('geoSelTxt').value = '&for=';
      document.getElementById('varSelTxt').value = "?get=";

      $scope.getField = "";
      $scope.forField = "";
      $scope.goTable = "";
      $scope.hastime = false;
      $scope.datetime = "";

      document.getElementById('mainTable').style.visibility = 'collapse';
      document.getElementById('expandTable').style.visibility = 'visible';

      $scope.endpointTtl = urLinkTtl;
      $scope.endpoint = urLink;
      document.getElementById('TableLinkField').value = $scope.endpoint;

      $http.get(urLink+'/variables.json').success(function(varLoad){
        $scope.variables = varLoad.variables;

        if($scope.variables.time){
          $scope.hastime = true;
          $scope.datetime = $scope.variables.time.datetime;
          console.log($scope.datetime);
        };
         
      });

      $http.get(urLink+'/geography.json').success(function(geoLoad){
          $scope.geography = geoLoad.fips;
      });
      

    };

    $scope.addVar = function() {

      options = document.getElementById('varSel');
      optionsSel = [];

      for (i=0;i<options.length;i++){
        if(options[i].selected){
          optionsSel.push(options[i].value);
        }
      }
      document.getElementById('varSelTxt').value = "?get=" + optionsSel;
    };

    $scope.addGeo = function() {
      document.getElementById('geoSelTxt').value = '&for=';
      optionsgeo = document.getElementById('geoSel');
      optionstime = document.getElementById('timeSel');
      optionsSel = '';

      for (i=0;i<optionsgeo.length;i++){
        if(optionsgeo[i].selected){
          optionsSel = optionsgeo[i].value;
          document.getElementById('geoSelTxt').value += optionsSel +':*';
        }
      };

      for (i=0;i<optionstime.length;i++){
        if(optionstime[i].selected){
          optionsSel = optionstime[i].value.toUpperCase();
          document.getElementById('geoSelTxt').value += '&' + optionsSel +'=*';
        }
      }
      
    };


    $scope.addVartoLink = function() {
      $scope.getField = document.getElementById('varSelTxt').value;
      $scope.goTable = $scope.endpoint + $scope.getField + $scope.forField;
      document.getElementById('TableLinkField').value = $scope.goTable;
    };

    $scope.addGeotoLink = function() {
      $scope.forField = document.getElementById('geoSelTxt').value;
      $scope.goTable = $scope.endpoint + $scope.getField + $scope.forField;
      document.getElementById('TableLinkField').value = $scope.goTable;
    };

    $scope.clearVar = function() {
      $scope.getField = '';
      $scope.goTable = $scope.endpoint + $scope.getField + $scope.forField;
      document.getElementById('TableLinkField').value = $scope.goTable;
      document.getElementById('varSelTxt').value = "?get=";
      document.getElementById('varSel').selectedIndex = -1;
    };

    $scope.clearGeo = function() {
      $scope.forField = '';
      $scope.goTable = $scope.endpoint + $scope.getField + $scope.forField;
      document.getElementById('TableLinkField').value = $scope.goTable;
      document.getElementById('geoSelTxt').value = '&for=';
      document.getElementById('geoSel').selectedIndex = -1;
      document.getElementById('timeSel').selectedIndex = -1;
    }

    $scope.goTableLink = function goTableLink (argument) {
      window.open(document.getElementById('TableLinkField').value,'_blank');
    };

  });

