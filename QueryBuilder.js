
var getField = "";
var forField = "";
var tableLink = "";

document.getElementById('mainTable').style.display = 'none';
document.getElementById('expandTable').style.display = 'none';

var app = angular.module("MetricsAPI",[]);

  app.controller("titles", function($scope,$http,$q) {
    $scope.datasetsInfo = [];
    $scope.variables;
    $scope.geographies;
    $scope.datetime; 
    $scope.hastime = false;
    $scope.required = false;
    $scope.getField = "";
    $scope.forField = "";
    $scope.timeField = "";

    $scope.loadDiscovery = function(select) { 

      document.getElementById('mainTable').style.display = 'inline';
      document.getElementById('expandTable').style.display = 'none';
      document.getElementById('varFilterInput').value = ' ';

      var url = document.getElementById("selection");
      var urlSel = url.options[url.selectedIndex].value;
    
      $scope.datasetsInfo = [];

      $http.get(urlSel + '.json?key=86ef546139db8dddaff1b4a9562f9a902f2b60b0')
        .then(function(response){
          
        for(i=0;i<response.data.dataset.length;i++){
          var id = response.data.dataset[i].identifier;
          $scope.datasetsInfo.push(
              {title : response.data.dataset[i].title+' ('+id.substring(id.lastIndexOf("/") + 1, id.length)+')', 
              description : response.data.dataset[i].description,
              varLink : response.data.dataset[i].c_variablesLink.replace("/variables.json",'')
          });

        };
          
        });
    };


    $scope.loadOptionsList = function(urLink,urLinkTtl) {
      document.getElementById('mainTable').style.display = 'none';
      document.getElementById('expandTable').style.display = 'inline';

      document.getElementById('geoSelTxt').value = '&for=';
      document.getElementById('varSelTxt').value = "?get=";
      document.getElementById('varSel').selectedIndex = -1;
      document.getElementById('varSel2').innerHTML = '';
      document.getElementById('timeSel').selectedIndex = -1;

      $scope.getField = "";
      $scope.forField = "";
      $scope.goTable = "";
      $scope.datetime = "";
      $scope.hastime = false;
      $scope.required = false;
      $scope.requiredVar = [];
      $scope.variables2 = [];

      $scope.endpointTtl = urLinkTtl;
      $scope.endpoint = urLink;
      document.getElementById('TableLinkField').value = $scope.endpoint;

      $http.get(urLink+'/variables.json?key=86ef546139db8dddaff1b4a9562f9a902f2b60b0').success(function(varLoad){

        Object.keys(varLoad.variables).forEach(function(key,index){
          $scope.variables2.push([key, varLoad.variables[key].label, varLoad.variables[key].predicateOnly, varLoad.variables[key].time]);
        });

        $scope.variables = varLoad.variables;

        if($scope.variables.time){
          $scope.hastime = true;
          $scope.datetime = $scope.variables.time.datetime;
          $scope.datetime.time = true;
        };

        Object.keys($scope.variables).forEach(function(key,index){
          if($scope.variables[key].required && $scope.variables[key].predicateOnly !== true){
            $scope.requiredVar.push(key);
            $scope.required = true;
          }
        });
         
      });

      $http.get(urLink+'/geography.json?key=86ef546139db8dddaff1b4a9562f9a902f2b60b0').success(function(geoLoad){
          $scope.geography = geoLoad.fips;
      });
      

    };

    $scope.addVar = function() {

      options = document.getElementById('varSel');
      selections = document.getElementById('varSel2');

      for (i=0;i<options.length;i++){
        if(options[i].selected){
          selections.innerHTML += '<option value="'+options[i].value+'">'+options[i].label+'</option>';
        }
      };

      var required = '';
      if($scope.required == true){required = ','};

      options = document.getElementById('varSel2');
      optionsSel = [];

      for (i=0;i<options.length;i++){
          optionsSel.push(options[i].value);
      };
      
      document.getElementById('varSelTxt').value = "?get=" + $scope.requiredVar + required + optionsSel;

      document.getElementById('varSel').selectedIndex = -1;
    };


    $scope.upVar = function() {

      selections = document.getElementById('varSel2');

      for (i=0;i<selections.length;i++){
        if(selections[i].selected){
          selections[i].remove();
          document.getElementById('varSel2').selectedIndex = i;
        }
      };

      var required = '';
      if($scope.required == true){required = ','};

      options = document.getElementById('varSel2');
      optionsSel = [];

      for (i=0;i<options.length;i++){
          optionsSel.push(options[i].value);
      }
      
      document.getElementById('varSelTxt').value = "?get=" + $scope.requiredVar + required + optionsSel;

    };


    $scope.addGeo = function() {

      document.getElementById('geoSelTxt').value = '&for=';
      optionsgeo = document.getElementById('geoSel');
      optionstime = document.getElementById('timeSel');
      optionsSel = '';
      optionshasdate = false;
      optionsReq = '';

      for (i=0;i<optionsgeo.length;i++){
        if(optionsgeo[i].selected){
          optionshasdate = true;
          optionsSel = optionsgeo[i].value.split(' -- ');
          optionsReq = optionsSel[0] + ':*';

          for (j=1;j<optionsSel.length;j++){
              optionsReq += '&in=' + optionsSel[j] + ':*';
            }
          }

      };

      document.getElementById('geoSelTxt').value += optionsReq;

      for (i=0;i<optionstime.length;i++){
        if(optionstime[i].selected){
          if(optionshasdate == false){document.getElementById('geoSelTxt').value = '&'}
          if(optionstime[i].value == 'time') {
            optionsSel = optionstime[i].value;
          } else {
            optionsSel = optionstime[i].value.toUpperCase();
          }
          if(optionshasdate == true) {
            document.getElementById('geoSelTxt').value += '&' + optionsSel + '=*'
          } else {
            document.getElementById('geoSelTxt').value += optionsSel + '=*'
          };
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
      document.getElementById('varSel2').innerHTML = '';
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

    $scope.goTableLink_adv = function goTableLink (argument) {
      sessionStorage.setItem('query',document.getElementById('TableLinkField').value + '&key=86ef546139db8dddaff1b4a9562f9a902f2b60b0');
      window.open("QueryBuilderOut.html",'_blank');
    };

    $scope.goTableLink = function goTableLink (argument) {
      window.open(document.getElementById('TableLinkField').value + '&key=86ef546139db8dddaff1b4a9562f9a902f2b60b0','_blank');
    };

  });


