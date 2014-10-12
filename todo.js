 var tx = angular.module('TodoApp',['ui.sortable','LocalStorageModule']);

    tx.directive('txContenteditable', ['$compile', function($compile) {
        return {
            restrict: "A",
            scope : {
              old : '@'
            },
            require: "ngModel",
            link: function(scope, element, attrs, ngModel) {

                element.bind("click", function(e) {
                    e.preventDefault();
                });

                element.attr("contenteditable", true);

                function read() {
                    ngModel.$setViewValue(element.html());
                }

                ngModel.$render = function() {

                        element.html(ngModel.$viewValue || '' );

                };

                ngModel.$isEmpty('tareq');

                element.bind("keydown", function(e) {
                    if (e.keyCode == 13) {
                        document.execCommand('insertHTML', false, '<br><br>');
                        return false;
                    }
                });

                element.bind("blur keyup change", function(e) {
                    scope.$apply(read);
                });
            }
        };
    }]);





 tx.directive('ngColorPicker',  ['$compile', function($compile){
    var defaultColors = ['#27c24c', '#5484ed', '#fad733', '#7266ba', '#23b7e5','#ee3939'];
    return {
        scope: {
            selected: '=',
            customizedColors: '=colors',
            
        },
        require: "ngModel",
        restrict: 'AE',
        template: '<ul class="colorui"><li ng-repeat="color in colors" ng-class="{selected: (color===selected)}" ng-click="pick(color)" style="background-color:{{color}};"></li></ul>',
        link: function(scope, element, attr) {
            scope.colors = scope.customizedColors || defaultColors;
            scope.selected = scope.selected || scope.colors[0];

            scope.pick = function(color) {
                scope.selected = color;
            };

            function read(){
                    ngModel.$setViewValue(scope.selected);
            }

            element.bind("blur keyup change", function(e) {
                  scope.$apply(read);
            });
        }
    };

}]);

tx.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});



tx.controller('TodoContrl', ['$scope','localStorageService','$timeout',function($scope,localStorageService,$timeout){

   
    $scope.init = function(){
       if ( localStorageService.get("todos")===null ){
            $scope.todos = [{ 
                title : "First task" , done : false 
            }];
       }else{
         $scope.todos = localStorageService.get("todos");
       }
    };

    $scope.$watch("todos",function( newVal,oldVal ){
       if ( newVal !== null && angular.isDefined(newVal) && newVal!==oldVal ){
              localStorageService.add("todos",angular.toJson(newVal));
       }
    },true);



    $scope.title = "Todo list for hackers";

    $scope.todos = [];

    $scope.sortableOptions = {
       
        handle: '.pin' 
    };





		$scope.remaining = function(){
      var count = 0;

      angular.forEach($scope.todos , function(todo){
          count+= todo.done ? 0:1;
      });
      return count;
    }



    $scope.archive = function(){
    	  var count = 0;
        angular.forEach($scope.todos , function(todo){
            count+= todo.done ? 1:0;
        });
        return count;
    }


  	$scope.addIntodo = function(){
  		var data = $scope.todos;
  			$scope.todos.push({
  				id : data.length + 1,
                  title: $scope.todoText,
                  done: true,
                  color : '#23b7e5',              
                  items: []

          });  		
  		$scope.todoText = '';  		
  	}


  	$scope.isDone = function(scope){
  		todo = scope.$modelValue;
  		if( todo.done == false){
  			todo.done = true;
  		}else{
  			todo.done = false;
  		}
  	}

    $scope.selectedItem = {};
    $scope.options = {};

   	$scope.removeTodo = function(index) {
        
          $scope.todos.splice(index, 1);
    };



// TIME


    $scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000 //ms

    var tick = function () {
        $scope.clock = Date.now() // get the current time
        $timeout(tick, $scope.tickInterval); // reset the timer
    }

    // Start the timer
    $timeout(tick, $scope.tickInterval);

















   localStorageService.bind($scope, 'todos', $scope.todos); 
 

}]);




