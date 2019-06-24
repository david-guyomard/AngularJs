(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

angular.module('app', ['ui.router']);

require('./controllers');
require('./components');
require('./services');

require('./routes');
require('./run');

},{"./components":3,"./controllers":8,"./routes":10,"./run":11,"./services":13}],2:[function(require,module,exports){
'use strict';

angular.module('app').component('home', {

  template:'<div class="panel panel-default"><div class="panel-heading">HOME PAGE</div><div class="panel-body"></div></div>',

  controller: ["$log", function controller($log) {
    'ngInject';

    this.$onInit = function () {
      $log.info('home component loaded');
    };
  }]
});

},{}],3:[function(require,module,exports){
'use strict';

require('./home');
require('./login');
require('./users');
require('./user');
require('./superpage');

},{"./home":2,"./login":4,"./superpage":5,"./user":6,"./users":7}],4:[function(require,module,exports){
'use strict';

angular.module('app').component('login', {

  template:'<div class="panel panel-default"><div class="panel-heading">Vous devez vous identifier</div><div class="panel-body"><div class="alert alert-danger" ng-show="$ctrl.errorMessage">{{$ctrl.errorMessage}}</div><div class="form-group">Créer mon compte <input ng-model="create" type="checkbox"></div><div ng-show="create" class="form-group"><input ng-model="$ctrl.user.name" placeholder="Nom" type="text" class="form-control"></div><div class="form-group"><input ng-model="$ctrl.user.email" placeholder="Adresse mail" type="text" class="form-control"></div><div class="form-group"><input ng-model="$ctrl.user.password" placeholder="Mot de passe" type="password" class="form-control"></div><hr><button class="btn btn-primary" ng-click="$ctrl.submit($ctrl.user)">Valider</button></div></div>',

  bindings: {
    redirect: '<'
  },

  controller: ["AuthService", "$state", function controller(AuthService, $state) {
    'ngInject';

    var _this = this;

    this.$onInit = function () {
      _this.errorMessage = '';
      _this.user = {};
    };

    this.submit = function (user) {

      _this.errorMessage = '';

      if (typeof user.name != 'undefined') {
        AuthService.createUser(user).then(function () {
          $state.go(_this.redirect ? _this.redirect : 'home');
        }).catch(function () {
          _this.errorMessage = 'Une erreur s\'est produite';
        });
      } else {
        AuthService.connect(user.email, user.password).then(function () {
          $state.go(_this.redirect ? _this.redirect : 'home');
        }).catch(function () {
          _this.errorMessage = 'Utilisateur introuvable ou mot de passe invalide';
        });
      }
    };
  }]
});

},{}],5:[function(require,module,exports){
'use strict';

angular.module('app').component('superpage', {

  template:'<div class="panel panel-default"><div class="panel-heading">SUPER PAGE</div><div class="panel-body"><div ng-app="app" ng-controller="main as ctrl"><select ng-model="selectedSuper" ng-options="super.name for super in hero"></select></div></div></div>',

  controller: ["$log", "$scope", function controller($log, $scope) {
    'ngInject';

    $scope.hero = [{ name: "superman" }, { name: "spiderman" }, { name: "ironman" }, { name: "aquaman" }, { name: "hulk" }];
    this.$onInit = function () {
      $log.info('superpage component loaded');
    };
  }]
});

},{}],6:[function(require,module,exports){
'use strict';

angular.module('app').component('user', {

  template:'<div class="panel panel-default"><div class="panel-heading">USER PAGE</div><div class="panel-body"><label>Identifier</label><div>{{$ctrl.user.id}}</div><label>Name:</label><div>{{$ctrl.user.name}}</div><label>Email</label><div>{{$ctrl.user.email}}</div><hr><a class="btn btn-default" ui-sref="users">Return to users list</a></div></div>',

  bindings: {
    user: '<'
  },

  controller: ["$log", function controller($log) {
    'ngInject';

    this.$onInit = function () {
      $log.info('user component loaded');
    };
  }]
});

},{}],7:[function(require,module,exports){
'use strict';

angular.module('app').component('users', {

  template:'<div class="panel panel-default"><div class="panel-heading">USERS PAGE</div><div class="panel-body"><table ng-if="$ctrl.users" class="table"><tr ng-repeat="user in $ctrl.users"><td>{{user.id}}</td><td><a ui-sref="user({ id: user.id })">{{user.name}}</a></td><td>{{user.email}}</td></tr></table></div></div>',

  bindings: {
    users: '<'
  },

  controller: ["$log", function controller($log) {
    'ngInject';

    this.$onInit = function () {
      $log.info('users component loaded');
    };
  }]
});

},{}],8:[function(require,module,exports){
'use strict';

require('./main');

},{"./main":9}],9:[function(require,module,exports){
'use strict';

angular.module('app').controller('main', ["AuthService", "$rootScope", "$state", function (AuthService, $rootScope, $state) {
  'ngInject';

  var _this = this;

  this.isAuthenticated = AuthService.isAuthenticated();

  $rootScope.$on('AUTH', function (event, connected) {
    _this.isAuthenticated = connected;
    if (!connected) {
      $state.go('home');
    }
  });

  this.disconnect = function () {
    AuthService.disconnect();
  };
}]);

},{}],10:[function(require,module,exports){
'use strict';

angular.module('app').config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  'ngInject';

  $stateProvider.state('home', {
    url: '/home',
    component: 'home'
  }).state('superpage', {
    url: '/superpage',
    component: 'superpage'
  }).state('users', {
    url: '/users',
    component: 'users',
    authenticate: true,
    resolve: {
      users: ["UsersService", function users(UsersService) {
        return UsersService.getUsers();
      }]
    }
  }).state('user', {
    url: '/user/:id',
    component: 'user',
    authenticate: true,
    resolve: {
      user: ["UsersService", "$transition$", function user(UsersService, $transition$) {
        return UsersService.getUser($transition$.params().id);
      }]
    }
  }).state('login', {
    url: '/login',
    component: 'login',
    resolve: {
      redirect: ["$state", function redirect($state) {
        return $state.transition._targetState._params.redirect;
      }]
    }
  });

  $urlRouterProvider.otherwise('/home');
}]);

},{}],11:[function(require,module,exports){
'use strict';

angular.module('app').run(["AuthService", "$log", "$state", "$transitions", function (AuthService, $log, $state, $transitions) {
  'ngInject';

  // ui-router transitions

  $transitions.onBefore({}, function (transition) {

    // Get the requested route
    var to = transition.to();

    if (to.authenticate && !AuthService.isAuthenticated()) {

      // User isn’t authenticated, redirect to login page
      $log.debug(to.url + ' need authentication');

      return transition.router.stateService.target("login", {
        redirect: to.name
      });
    }
  });
}]);

},{}],12:[function(require,module,exports){
'use strict';

angular.module('app').service('AuthService', ["$rootScope", "$q", "$http", "$window", function ($rootScope, $q, $http, $window) {
  'ngInject';

  var _this = this;

  var API_URL = 'http://api.project-symfony.fr/login';
  var KEY = 'app-auth';

  this.isAuthenticated = function () {
    var user = angular.fromJson($window.localStorage.getItem(KEY));
    return user && typeof user.id != 'undefined';
  };

  this.getCurrentUser = function () {
    if (_this.isAuthenticated()) {
      var userAuth = angular.fromJson($window.localStorage.getItem(KEY));
      return userAuth.user;
    }
    return null;
  };

  this.getToken = function () {
    if (_this.isAuthenticated() && _this.getCurrentUser()) {
      var userAuth = angular.fromJson($window.localStorage.getItem(KEY));
      return userAuth.value;
    }
    return null;
  };

  this.getUserByEmail = function (email) {
    var defer = $q.defer();

    $http.get(API_URL + ('?email=' + email)).then(function (response) {
      if (response.data.length > 0) {
        defer.resolve(response.data);
      } else {
        defer.reject();
      }
    }).catch(function () {
      defer.reject();
    });

    return defer.promise;
  };

  this.createUser = function (user) {

    var defer = $q.defer();

    _this.getUserByEmail(user.email).then(function () {
      defer.reject();
    }).catch(function () {
      $http.post(API_URL, user).then(function (response) {
        $window.localStorage.setItem(KEY, angular.toJson(response.data));
        $rootScope.$emit('AUTH', true);
        defer.resolve();
      });
    });

    return defer.promise;
  };

  this.connect = function (email, pwd) {

    var defer = $q.defer();
    var data = {
      login: email,
      password: pwd
    };
    $http.post(API_URL, data).then(function (response) {
      if (response.data) {
        $window.localStorage.setItem(KEY, angular.toJson(response.data));
        $rootScope.$emit('AUTH', true);
        defer.resolve();
      } else {
        defer.reject();
      }
    }).catch(function (response) {
      defer.reject();
    });

    return defer.promise;
    /*$http.get(API_URL + `?email=${email}&password=${pwd}`).then((response) => {
      if (response.data.length > 0) {
        $window.localStorage.setItem(KEY, angular.toJson(response.data[0]));
        $rootScope.$emit('AUTH', true);
        defer.resolve();
      } else {
        defer.reject();
      }
    }).catch((response) => {
      defer.reject();
    });
     return defer.promise;*/
  };

  this.disconnect = function () {
    $window.localStorage.removeItem(KEY);
    $rootScope.$emit('AUTH', false);
  };
}]);

},{}],13:[function(require,module,exports){
'use strict';

require('./auth');
require('./users');

},{"./auth":12,"./users":14}],14:[function(require,module,exports){
'use strict';

angular.module('app').service('UsersService', ["$q", "$http", "AuthService", function ($q, $http, AuthService) {
  'ngInject';

  var API_URL = 'http://api.project-symfony.fr/users/list';

  this.getUsers = function () {
    var defer = $q.defer();
    var token = AuthService.getToken();
    $http.get(API_URL, {
      headers: {
        'X-Auth-Token': token
      }
    }).then(function (response) {
      defer.resolve(response.data);
    }).catch(function (response) {
      defer.reject(response.statusText);
    });

    return defer.promise;
  };

  this.getUser = function (id) {
    var defer = $q.defer();

    $http.get(API_URL + ('/' + id)).then(function (response) {
      defer.resolve(response.data);
    }).catch(function (response) {
      defer.reject(response.statusText);
    });

    return defer.promise;
  };
}]);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9hcHAuanMiLCJqcy9jb21wb25lbnRzL2hvbWUuanMiLCJqcy9jb21wb25lbnRzL2luZGV4LmpzIiwianMvY29tcG9uZW50cy9sb2dpbi5qcyIsImpzL2NvbXBvbmVudHMvc3VwZXJwYWdlLmpzIiwianMvY29tcG9uZW50cy91c2VyLmpzIiwianMvY29tcG9uZW50cy91c2Vycy5qcyIsImpzL2NvbnRyb2xsZXJzL2luZGV4LmpzIiwianMvY29udHJvbGxlcnMvbWFpbi5qcyIsImpzL3JvdXRlcy5qcyIsImpzL3J1bi5qcyIsImpzL3NlcnZpY2VzL2F1dGguanMiLCJqcy9zZXJ2aWNlcy9pbmRleC5qcyIsImpzL3NlcnZpY2VzL3VzZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBRUEsUUFBUSxNQUFSLENBQWUsS0FBZixFQUFzQixDQUNwQixXQURvQixDQUF0Qjs7QUFJQSxRQUFRLGVBQVI7QUFDQSxRQUFRLGNBQVI7QUFDQSxRQUFRLFlBQVI7O0FBRUEsUUFBUSxVQUFSO0FBQ0EsUUFBUSxPQUFSOzs7QUNYQTs7QUFFQSxRQUFRLE1BQVIsQ0FBZSxLQUFmLEVBRUcsU0FGSCxDQUVhLE1BRmIsRUFFcUI7O0FBRWpCLGVBQWEsa0JBRkk7O0FBSWpCLGNBQVksb0JBQVUsSUFBVixFQUFnQjtBQUMxQjs7QUFFQSxTQUFLLE9BQUwsR0FBZSxZQUFNO0FBQ25CLFdBQUssSUFBTCxDQUFVLHVCQUFWO0FBQ0QsS0FGRDtBQUdEO0FBVmdCLENBRnJCOzs7QUNGQTs7QUFFQSxRQUFRLFFBQVI7QUFDQSxRQUFRLFNBQVI7QUFDQSxRQUFRLFNBQVI7QUFDQSxRQUFRLFFBQVI7QUFDQSxRQUFRLGFBQVI7OztBQ05BOztBQUVBLFFBQVEsTUFBUixDQUFlLEtBQWYsRUFFRyxTQUZILENBRWEsT0FGYixFQUVzQjs7QUFFbEIsZUFBYSxtQkFGSzs7QUFJbEIsWUFBVTtBQUNSLGNBQVU7QUFERixHQUpROztBQVFsQixjQUFZLG9CQUFVLFdBQVYsRUFBdUIsTUFBdkIsRUFBK0I7QUFDekM7O0FBRHlDOztBQUd6QyxTQUFLLE9BQUwsR0FBZSxZQUFNO0FBQ25CLFlBQUssWUFBTCxHQUFvQixFQUFwQjtBQUNBLFlBQUssSUFBTCxHQUFZLEVBQVo7QUFDRCxLQUhEOztBQUtBLFNBQUssTUFBTCxHQUFjLFVBQUMsSUFBRCxFQUFVOztBQUV0QixZQUFLLFlBQUwsR0FBb0IsRUFBcEI7O0FBRUEsVUFBSSxPQUFPLEtBQUssSUFBWixJQUFvQixXQUF4QixFQUFxQztBQUNuQyxvQkFBWSxVQUFaLENBQXVCLElBQXZCLEVBQTZCLElBQTdCLENBQWtDLFlBQU07QUFDdEMsaUJBQU8sRUFBUCxDQUFVLE1BQUssUUFBTCxHQUFnQixNQUFLLFFBQXJCLEdBQWdDLE1BQTFDO0FBQ0QsU0FGRCxFQUVHLEtBRkgsQ0FFUyxZQUFNO0FBQ2IsZ0JBQUssWUFBTDtBQUNELFNBSkQ7QUFLRCxPQU5ELE1BTU87QUFDTCxvQkFBWSxPQUFaLENBQW9CLEtBQUssS0FBekIsRUFBZ0MsS0FBSyxRQUFyQyxFQUErQyxJQUEvQyxDQUFvRCxZQUFNO0FBQ3hELGlCQUFPLEVBQVAsQ0FBVSxNQUFLLFFBQUwsR0FBZ0IsTUFBSyxRQUFyQixHQUFnQyxNQUExQztBQUNELFNBRkQsRUFFRyxLQUZILENBRVMsWUFBTTtBQUNiLGdCQUFLLFlBQUw7QUFDRCxTQUpEO0FBS0Q7QUFDRixLQWpCRDtBQWtCRDtBQWxDaUIsQ0FGdEI7OztBQ0ZBOztBQUVBLFFBQVEsTUFBUixDQUFlLEtBQWYsRUFFRyxTQUZILENBRWEsV0FGYixFQUUwQjs7QUFFdEIsZUFBYSx1QkFGUzs7QUFJdEIsY0FBWSxvQkFBVSxJQUFWLEVBQWdCLE1BQWhCLEVBQXdCO0FBQ2xDOztBQUNBLFdBQU8sSUFBUCxHQUFjLENBQ1osRUFBQyxNQUFNLFVBQVAsRUFEWSxFQUVaLEVBQUMsTUFBTSxXQUFQLEVBRlksRUFHWixFQUFDLE1BQU0sU0FBUCxFQUhZLEVBSVosRUFBQyxNQUFNLFNBQVAsRUFKWSxFQUtaLEVBQUMsTUFBTSxNQUFQLEVBTFksQ0FBZDtBQU9BLFNBQUssT0FBTCxHQUFlLFlBQU07QUFDbkIsV0FBSyxJQUFMLENBQVUsNEJBQVY7QUFFRCxLQUhEO0FBSUQ7QUFqQnFCLENBRjFCOzs7QUNGQTs7QUFFQSxRQUFRLE1BQVIsQ0FBZSxLQUFmLEVBRUcsU0FGSCxDQUVhLE1BRmIsRUFFcUI7O0FBRWpCLGVBQWEsa0JBRkk7O0FBSWpCLFlBQVU7QUFDUixVQUFNO0FBREUsR0FKTzs7QUFRakIsY0FBWSxvQkFBVSxJQUFWLEVBQWdCO0FBQzFCOztBQUVBLFNBQUssT0FBTCxHQUFlLFlBQU07QUFDbkIsV0FBSyxJQUFMLENBQVUsdUJBQVY7QUFDRCxLQUZEO0FBSUQ7QUFmZ0IsQ0FGckI7OztBQ0ZBOztBQUVBLFFBQVEsTUFBUixDQUFlLEtBQWYsRUFFRyxTQUZILENBRWEsT0FGYixFQUVzQjs7QUFFbEIsZUFBYSxtQkFGSzs7QUFJbEIsWUFBVTtBQUNSLFdBQU87QUFEQyxHQUpROztBQVFsQixjQUFZLG9CQUFVLElBQVYsRUFBZ0I7QUFDMUI7O0FBRUEsU0FBSyxPQUFMLEdBQWUsWUFBTTtBQUNuQixXQUFLLElBQUwsQ0FBVSx3QkFBVjtBQUNELEtBRkQ7QUFJRDtBQWZpQixDQUZ0Qjs7O0FDRkE7O0FBRUEsUUFBUSxRQUFSOzs7QUNGQTs7QUFFQSxRQUFRLE1BQVIsQ0FBZSxLQUFmLEVBRUcsVUFGSCxDQUVjLE1BRmQsRUFFc0IsVUFBVSxXQUFWLEVBQXVCLFVBQXZCLEVBQW1DLE1BQW5DLEVBQTJDO0FBQzdEOztBQUQ2RDs7QUFHN0QsT0FBSyxlQUFMLEdBQXVCLFlBQVksZUFBWixFQUF2Qjs7QUFFQSxhQUFXLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLFVBQUMsS0FBRCxFQUFRLFNBQVIsRUFBc0I7QUFDM0MsVUFBSyxlQUFMLEdBQXVCLFNBQXZCO0FBQ0EsUUFBSSxDQUFDLFNBQUwsRUFBZ0I7QUFDZCxhQUFPLEVBQVAsQ0FBVSxNQUFWO0FBQ0Q7QUFDRixHQUxEOztBQU9BLE9BQUssVUFBTCxHQUFrQixZQUFNO0FBQ3RCLGdCQUFZLFVBQVo7QUFDRCxHQUZEO0FBSUQsQ0FsQkg7OztBQ0ZBOztBQUVBLFFBQVEsTUFBUixDQUFlLEtBQWYsRUFFRyxNQUZILENBRVUsVUFBVSxjQUFWLEVBQTBCLGtCQUExQixFQUE4QztBQUNwRDs7QUFFQSxpQkFDRyxLQURILENBQ1MsTUFEVCxFQUNpQjtBQUNiLFNBQUssT0FEUTtBQUViLGVBQVc7QUFGRSxHQURqQixFQUtHLEtBTEgsQ0FLUyxXQUxULEVBS3NCO0FBQ2xCLFNBQUssWUFEYTtBQUVsQixlQUFXO0FBRk8sR0FMdEIsRUFTRyxLQVRILENBU1MsT0FUVCxFQVNrQjtBQUNkLFNBQUssUUFEUztBQUVkLGVBQVcsT0FGRztBQUdkLGtCQUFjLElBSEE7QUFJZCxhQUFTO0FBQ1AsYUFBTyxlQUFVLFlBQVYsRUFBd0I7QUFDN0IsZUFBTyxhQUFhLFFBQWIsRUFBUDtBQUNEO0FBSE07QUFKSyxHQVRsQixFQW1CRyxLQW5CSCxDQW1CUyxNQW5CVCxFQW1CaUI7QUFDYixTQUFLLFdBRFE7QUFFYixlQUFXLE1BRkU7QUFHYixrQkFBYyxJQUhEO0FBSWIsYUFBUztBQUNQLFlBQU0sY0FBVSxZQUFWLEVBQXdCLFlBQXhCLEVBQXNDO0FBQzFDLGVBQU8sYUFBYSxPQUFiLENBQXFCLGFBQWEsTUFBYixHQUFzQixFQUEzQyxDQUFQO0FBQ0Q7QUFITTtBQUpJLEdBbkJqQixFQTZCRyxLQTdCSCxDQTZCUyxPQTdCVCxFQTZCa0I7QUFDZCxTQUFLLFFBRFM7QUFFZCxlQUFXLE9BRkc7QUFHZCxhQUFTO0FBQ1AsZ0JBQVUsa0JBQVUsTUFBVixFQUFrQjtBQUMxQixlQUFPLE9BQU8sVUFBUCxDQUFrQixZQUFsQixDQUErQixPQUEvQixDQUF1QyxRQUE5QztBQUNEO0FBSE07QUFISyxHQTdCbEI7O0FBdUNBLHFCQUFtQixTQUFuQixDQUE2QixPQUE3QjtBQUNELENBN0NIOzs7QUNGQTs7QUFFQSxRQUFRLE1BQVIsQ0FBZSxLQUFmLEVBRUcsR0FGSCxDQUVPLFVBQVUsV0FBVixFQUF1QixJQUF2QixFQUE2QixNQUE3QixFQUFxQyxZQUFyQyxFQUFtRDtBQUN0RDs7QUFFQTs7QUFFQSxlQUFhLFFBQWIsQ0FBc0IsRUFBdEIsRUFBMEIsVUFBQyxVQUFELEVBQWdCOztBQUV4QztBQUNBLFFBQUksS0FBSyxXQUFXLEVBQVgsRUFBVDs7QUFFQSxRQUFJLEdBQUcsWUFBSCxJQUFtQixDQUFDLFlBQVksZUFBWixFQUF4QixFQUF1RDs7QUFFckQ7QUFDQSxXQUFLLEtBQUwsQ0FBVyxHQUFHLEdBQUgsR0FBUyxzQkFBcEI7O0FBRUEsYUFBTyxXQUFXLE1BQVgsQ0FBa0IsWUFBbEIsQ0FBK0IsTUFBL0IsQ0FBc0MsT0FBdEMsRUFBK0M7QUFDcEQsa0JBQVUsR0FBRztBQUR1QyxPQUEvQyxDQUFQO0FBR0Q7QUFDRixHQWREO0FBZ0JELENBdkJIOzs7QUNGQTs7QUFFQSxRQUFRLE1BQVIsQ0FBZSxLQUFmLEVBRUcsT0FGSCxDQUVXLGFBRlgsRUFFMEIsVUFBVSxVQUFWLEVBQXNCLEVBQXRCLEVBQTBCLEtBQTFCLEVBQWlDLE9BQWpDLEVBQTBDO0FBQ2hFOztBQURnRTs7QUFHaEUsTUFBTSxVQUFVLHFDQUFoQjtBQUNBLE1BQU0sTUFBTSxVQUFaOztBQUVBLE9BQUssZUFBTCxHQUF1QixZQUFNO0FBQzNCLFFBQUksT0FBTyxRQUFRLFFBQVIsQ0FBaUIsUUFBUSxZQUFSLENBQXFCLE9BQXJCLENBQTZCLEdBQTdCLENBQWpCLENBQVg7QUFDQSxXQUFPLFFBQVEsT0FBTyxLQUFLLEVBQVosSUFBa0IsV0FBakM7QUFDRCxHQUhEOztBQUtBLE9BQUssY0FBTCxHQUFzQixZQUFNO0FBQzFCLFFBQUksTUFBSyxlQUFMLEVBQUosRUFBMkI7QUFDekIsVUFBSSxXQUFXLFFBQVEsUUFBUixDQUFpQixRQUFRLFlBQVIsQ0FBcUIsT0FBckIsQ0FBNkIsR0FBN0IsQ0FBakIsQ0FBZjtBQUNBLGFBQU8sU0FBUyxJQUFoQjtBQUNEO0FBQ0QsV0FBTyxJQUFQO0FBQ0QsR0FORDs7QUFRQSxPQUFLLFFBQUwsR0FBZ0IsWUFBTTtBQUNwQixRQUFJLE1BQUssZUFBTCxNQUEwQixNQUFLLGNBQUwsRUFBOUIsRUFBb0Q7QUFDbEQsVUFBSSxXQUFXLFFBQVEsUUFBUixDQUFpQixRQUFRLFlBQVIsQ0FBcUIsT0FBckIsQ0FBNkIsR0FBN0IsQ0FBakIsQ0FBZjtBQUNBLGFBQU8sU0FBUyxLQUFoQjtBQUNEO0FBQ0QsV0FBTyxJQUFQO0FBQ0QsR0FORDs7QUFRQSxPQUFLLGNBQUwsR0FBc0IsVUFBQyxLQUFELEVBQVc7QUFDL0IsUUFBSSxRQUFRLEdBQUcsS0FBSCxFQUFaOztBQUVBLFVBQU0sR0FBTixDQUFVLHVCQUFvQixLQUFwQixDQUFWLEVBQXVDLElBQXZDLENBQTRDLFVBQUMsUUFBRCxFQUFjO0FBQ3hELFVBQUksU0FBUyxJQUFULENBQWMsTUFBZCxHQUF1QixDQUEzQixFQUE4QjtBQUM1QixjQUFNLE9BQU4sQ0FBYyxTQUFTLElBQXZCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsY0FBTSxNQUFOO0FBQ0Q7QUFDRixLQU5ELEVBTUcsS0FOSCxDQU1TLFlBQU07QUFDYixZQUFNLE1BQU47QUFDRCxLQVJEOztBQVVBLFdBQU8sTUFBTSxPQUFiO0FBQ0QsR0FkRDs7QUFnQkEsT0FBSyxVQUFMLEdBQWtCLFVBQUMsSUFBRCxFQUFVOztBQUUxQixRQUFJLFFBQVEsR0FBRyxLQUFILEVBQVo7O0FBRUEsVUFBSyxjQUFMLENBQW9CLEtBQUssS0FBekIsRUFBZ0MsSUFBaEMsQ0FBcUMsWUFBTTtBQUN6QyxZQUFNLE1BQU47QUFDRCxLQUZELEVBRUcsS0FGSCxDQUVTLFlBQU07QUFDYixZQUFNLElBQU4sQ0FBVyxPQUFYLEVBQW9CLElBQXBCLEVBQTBCLElBQTFCLENBQStCLFVBQUMsUUFBRCxFQUFjO0FBQzNDLGdCQUFRLFlBQVIsQ0FBcUIsT0FBckIsQ0FBNkIsR0FBN0IsRUFBa0MsUUFBUSxNQUFSLENBQWUsU0FBUyxJQUF4QixDQUFsQztBQUNBLG1CQUFXLEtBQVgsQ0FBaUIsTUFBakIsRUFBeUIsSUFBekI7QUFDQSxjQUFNLE9BQU47QUFDRCxPQUpEO0FBS0QsS0FSRDs7QUFVQSxXQUFPLE1BQU0sT0FBYjtBQUNELEdBZkQ7O0FBaUJBLE9BQUssT0FBTCxHQUFlLFVBQUMsS0FBRCxFQUFRLEdBQVIsRUFBZ0I7O0FBRTdCLFFBQUksUUFBUSxHQUFHLEtBQUgsRUFBWjtBQUNBLFFBQUksT0FBTztBQUNULGFBQVEsS0FEQztBQUVULGdCQUFVO0FBRkQsS0FBWDtBQUlBLFVBQU0sSUFBTixDQUFXLE9BQVgsRUFBb0IsSUFBcEIsRUFBMEIsSUFBMUIsQ0FBK0IsVUFBQyxRQUFELEVBQWM7QUFDM0MsVUFBSSxTQUFTLElBQWIsRUFBbUI7QUFDakIsZ0JBQVEsWUFBUixDQUFxQixPQUFyQixDQUE2QixHQUE3QixFQUFrQyxRQUFRLE1BQVIsQ0FBZSxTQUFTLElBQXhCLENBQWxDO0FBQ0EsbUJBQVcsS0FBWCxDQUFpQixNQUFqQixFQUF5QixJQUF6QjtBQUNBLGNBQU0sT0FBTjtBQUNELE9BSkQsTUFJTztBQUNMLGNBQU0sTUFBTjtBQUNEO0FBQ0YsS0FSRCxFQVFHLEtBUkgsQ0FRUyxVQUFDLFFBQUQsRUFBYztBQUNyQixZQUFNLE1BQU47QUFDRCxLQVZEOztBQVlBLFdBQU8sTUFBTSxPQUFiO0FBQ0E7Ozs7Ozs7Ozs7OztBQWFELEdBakNEOztBQW1DQSxPQUFLLFVBQUwsR0FBa0IsWUFBTTtBQUN0QixZQUFRLFlBQVIsQ0FBcUIsVUFBckIsQ0FBZ0MsR0FBaEM7QUFDQSxlQUFXLEtBQVgsQ0FBaUIsTUFBakIsRUFBeUIsS0FBekI7QUFDRCxHQUhEO0FBS0QsQ0F0R0g7OztBQ0ZBOztBQUVBLFFBQVEsUUFBUjtBQUNBLFFBQVEsU0FBUjs7O0FDSEE7O0FBRUEsUUFBUSxNQUFSLENBQWUsS0FBZixFQUVHLE9BRkgsQ0FFVyxjQUZYLEVBRTJCLFVBQVUsRUFBVixFQUFjLEtBQWQsRUFBcUIsV0FBckIsRUFBa0M7QUFDekQ7O0FBRUEsTUFBTSxVQUFVLDBDQUFoQjs7QUFFQSxPQUFLLFFBQUwsR0FBZ0IsWUFBTTtBQUNwQixRQUFJLFFBQVEsR0FBRyxLQUFILEVBQVo7QUFDQSxRQUFJLFFBQVEsWUFBWSxRQUFaLEVBQVo7QUFDQSxVQUFNLEdBQU4sQ0FBVSxPQUFWLEVBQW1CO0FBQ2pCLGVBQVM7QUFDUCx3QkFBZ0I7QUFEVDtBQURRLEtBQW5CLEVBSUcsSUFKSCxDQUlRLFVBQUMsUUFBRCxFQUFjO0FBQ3BCLFlBQU0sT0FBTixDQUFjLFNBQVMsSUFBdkI7QUFDRCxLQU5ELEVBTUcsS0FOSCxDQU1TLFVBQUMsUUFBRCxFQUFjO0FBQ3JCLFlBQU0sTUFBTixDQUFhLFNBQVMsVUFBdEI7QUFDRCxLQVJEOztBQVVBLFdBQU8sTUFBTSxPQUFiO0FBQ0QsR0FkRDs7QUFnQkEsT0FBSyxPQUFMLEdBQWUsVUFBQyxFQUFELEVBQVE7QUFDckIsUUFBSSxRQUFRLEdBQUcsS0FBSCxFQUFaOztBQUVBLFVBQU0sR0FBTixDQUFVLGlCQUFjLEVBQWQsQ0FBVixFQUE4QixJQUE5QixDQUFtQyxVQUFDLFFBQUQsRUFBYztBQUMvQyxZQUFNLE9BQU4sQ0FBYyxTQUFTLElBQXZCO0FBQ0QsS0FGRCxFQUVHLEtBRkgsQ0FFUyxVQUFDLFFBQUQsRUFBYztBQUNyQixZQUFNLE1BQU4sQ0FBYSxTQUFTLFVBQXRCO0FBQ0QsS0FKRDs7QUFNQSxXQUFPLE1BQU0sT0FBYjtBQUNELEdBVkQ7QUFXRCxDQWxDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcbiAgJ3VpLnJvdXRlcidcbl0pO1xuXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJzJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMnKTtcbnJlcXVpcmUoJy4vc2VydmljZXMnKTtcblxucmVxdWlyZSgnLi9yb3V0ZXMnKTtcbnJlcXVpcmUoJy4vcnVuJyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwJylcblxuICAuY29tcG9uZW50KCdob21lJywge1xuXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvaG9tZS5odG1sJyxcblxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkbG9nKSB7XG4gICAgICAnbmdJbmplY3QnO1xuXG4gICAgICB0aGlzLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICAgICRsb2cuaW5mbygnaG9tZSBjb21wb25lbnQgbG9hZGVkJyk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuL2hvbWUnKTtcbnJlcXVpcmUoJy4vbG9naW4nKTtcbnJlcXVpcmUoJy4vdXNlcnMnKTtcbnJlcXVpcmUoJy4vdXNlcicpO1xucmVxdWlyZSgnLi9zdXBlcnBhZ2UnKTsiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuXG4gIC5jb21wb25lbnQoJ2xvZ2luJywge1xuXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvbG9naW4uaHRtbCcsXG5cbiAgICBiaW5kaW5nczoge1xuICAgICAgcmVkaXJlY3Q6ICc8J1xuICAgIH0sXG5cbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuICAgICAgJ25nSW5qZWN0JztcblxuICAgICAgdGhpcy4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9ICcnO1xuICAgICAgICB0aGlzLnVzZXIgPSB7fTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuc3VibWl0ID0gKHVzZXIpID0+IHtcblxuICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9ICcnO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdXNlci5uYW1lICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgQXV0aFNlcnZpY2UuY3JlYXRlVXNlcih1c2VyKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICRzdGF0ZS5nbyh0aGlzLnJlZGlyZWN0ID8gdGhpcy5yZWRpcmVjdCA6ICdob21lJyk7XG4gICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBgVW5lIGVycmV1ciBzJ2VzdCBwcm9kdWl0ZWA7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgQXV0aFNlcnZpY2UuY29ubmVjdCh1c2VyLmVtYWlsLCB1c2VyLnBhc3N3b3JkKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICRzdGF0ZS5nbyh0aGlzLnJlZGlyZWN0ID8gdGhpcy5yZWRpcmVjdCA6ICdob21lJyk7XG4gICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBgVXRpbGlzYXRldXIgaW50cm91dmFibGUgb3UgbW90IGRlIHBhc3NlIGludmFsaWRlYDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG5cbiAgLmNvbXBvbmVudCgnc3VwZXJwYWdlJywge1xuXG4gICAgdGVtcGxhdGVVcmw6ICcvdmlld3Mvc3VwZXJwYWdlLmh0bWwnLFxuXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRsb2csICRzY29wZSkge1xuICAgICAgJ25nSW5qZWN0JztcbiAgICAgICRzY29wZS5oZXJvID0gW1xuICAgICAgICB7bmFtZTogXCJzdXBlcm1hblwifSxcbiAgICAgICAge25hbWU6IFwic3BpZGVybWFuXCJ9LFxuICAgICAgICB7bmFtZTogXCJpcm9ubWFuXCJ9LFxuICAgICAgICB7bmFtZTogXCJhcXVhbWFuXCJ9LFxuICAgICAgICB7bmFtZTogXCJodWxrXCJ9LFxuICAgICAgXTtcbiAgICAgIHRoaXMuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgICAgJGxvZy5pbmZvKCdzdXBlcnBhZ2UgY29tcG9uZW50IGxvYWRlZCcpO1xuICAgICAgICBcbiAgICAgIH07XG4gICAgfVxuICB9KTsiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuXG4gIC5jb21wb25lbnQoJ3VzZXInLCB7XG5cbiAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy91c2VyLmh0bWwnLFxuXG4gICAgYmluZGluZ3M6IHtcbiAgICAgIHVzZXI6ICc8J1xuICAgIH0sXG5cbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoJGxvZykge1xuICAgICAgJ25nSW5qZWN0JztcblxuICAgICAgdGhpcy4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgICAkbG9nLmluZm8oJ3VzZXIgY29tcG9uZW50IGxvYWRlZCcpO1xuICAgICAgfTtcblxuICAgIH1cbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwJylcblxuICAuY29tcG9uZW50KCd1c2VycycsIHtcblxuICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL3VzZXJzLmh0bWwnLFxuXG4gICAgYmluZGluZ3M6IHtcbiAgICAgIHVzZXJzOiAnPCdcbiAgICB9LFxuXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRsb2cpIHtcbiAgICAgICduZ0luamVjdCc7XG5cbiAgICAgIHRoaXMuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgICAgJGxvZy5pbmZvKCd1c2VycyBjb21wb25lbnQgbG9hZGVkJyk7XG4gICAgICB9O1xuXG4gICAgfVxuICB9KTsiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vbWFpbicpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwJylcblxuICAuY29udHJvbGxlcignbWFpbicsIGZ1bmN0aW9uIChBdXRoU2VydmljZSwgJHJvb3RTY29wZSwgJHN0YXRlKSB7XG4gICAgJ25nSW5qZWN0JztcblxuICAgIHRoaXMuaXNBdXRoZW50aWNhdGVkID0gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG5cbiAgICAkcm9vdFNjb3BlLiRvbignQVVUSCcsIChldmVudCwgY29ubmVjdGVkKSA9PiB7XG4gICAgICB0aGlzLmlzQXV0aGVudGljYXRlZCA9IGNvbm5lY3RlZDtcbiAgICAgIGlmICghY29ubmVjdGVkKSB7XG4gICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5kaXNjb25uZWN0ID0gKCkgPT4ge1xuICAgICAgQXV0aFNlcnZpY2UuZGlzY29ubmVjdCgpO1xuICAgIH07XG5cbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwJylcblxuICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgJ25nSW5qZWN0JztcblxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgIHVybDogJy9ob21lJyxcbiAgICAgICAgY29tcG9uZW50OiAnaG9tZSdcbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ3N1cGVycGFnZScsIHtcbiAgICAgICAgdXJsOiAnL3N1cGVycGFnZScsXG4gICAgICAgIGNvbXBvbmVudDogJ3N1cGVycGFnZSdcbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ3VzZXJzJywge1xuICAgICAgICB1cmw6ICcvdXNlcnMnLFxuICAgICAgICBjb21wb25lbnQ6ICd1c2VycycsXG4gICAgICAgIGF1dGhlbnRpY2F0ZTogdHJ1ZSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgIHVzZXJzOiBmdW5jdGlvbiAoVXNlcnNTZXJ2aWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gVXNlcnNTZXJ2aWNlLmdldFVzZXJzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnN0YXRlKCd1c2VyJywge1xuICAgICAgICB1cmw6ICcvdXNlci86aWQnLFxuICAgICAgICBjb21wb25lbnQ6ICd1c2VyJyxcbiAgICAgICAgYXV0aGVudGljYXRlOiB0cnVlLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgdXNlcjogZnVuY3Rpb24gKFVzZXJzU2VydmljZSwgJHRyYW5zaXRpb24kKSB7XG4gICAgICAgICAgICByZXR1cm4gVXNlcnNTZXJ2aWNlLmdldFVzZXIoJHRyYW5zaXRpb24kLnBhcmFtcygpLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICBjb21wb25lbnQ6ICdsb2dpbicsXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICByZWRpcmVjdDogZnVuY3Rpb24gKCRzdGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuICRzdGF0ZS50cmFuc2l0aW9uLl90YXJnZXRTdGF0ZS5fcGFyYW1zLnJlZGlyZWN0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaG9tZScpO1xuICB9KTsiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuXG4gIC5ydW4oZnVuY3Rpb24gKEF1dGhTZXJ2aWNlLCAkbG9nLCAkc3RhdGUsICR0cmFuc2l0aW9ucykge1xuICAgICduZ0luamVjdCc7XG5cbiAgICAvLyB1aS1yb3V0ZXIgdHJhbnNpdGlvbnNcblxuICAgICR0cmFuc2l0aW9ucy5vbkJlZm9yZSh7fSwgKHRyYW5zaXRpb24pID0+IHtcblxuICAgICAgLy8gR2V0IHRoZSByZXF1ZXN0ZWQgcm91dGVcbiAgICAgIHZhciB0byA9IHRyYW5zaXRpb24udG8oKTtcblxuICAgICAgaWYgKHRvLmF1dGhlbnRpY2F0ZSAmJiAhQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcblxuICAgICAgICAvLyBVc2VyIGlzbuKAmXQgYXV0aGVudGljYXRlZCwgcmVkaXJlY3QgdG8gbG9naW4gcGFnZVxuICAgICAgICAkbG9nLmRlYnVnKHRvLnVybCArICcgbmVlZCBhdXRoZW50aWNhdGlvbicpO1xuXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uLnJvdXRlci5zdGF0ZVNlcnZpY2UudGFyZ2V0KFwibG9naW5cIiwge1xuICAgICAgICAgIHJlZGlyZWN0OiB0by5uYW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG5cbiAgLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCAkaHR0cCwgJHdpbmRvdykge1xuICAgICduZ0luamVjdCc7XG5cbiAgICBjb25zdCBBUElfVVJMID0gJ2h0dHA6Ly9hcGkucHJvamVjdC1zeW1mb255LmZyL2xvZ2luJztcbiAgICBjb25zdCBLRVkgPSAnYXBwLWF1dGgnO1xuXG4gICAgdGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSAoKSA9PiB7XG4gICAgICB2YXIgdXNlciA9IGFuZ3VsYXIuZnJvbUpzb24oJHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShLRVkpKTtcbiAgICAgIHJldHVybiB1c2VyICYmIHR5cGVvZiB1c2VyLmlkICE9ICd1bmRlZmluZWQnO1xuICAgIH07XG5cbiAgICB0aGlzLmdldEN1cnJlbnRVc2VyID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNBdXRoZW50aWNhdGVkKCkpe1xuICAgICAgICBsZXQgdXNlckF1dGggPSBhbmd1bGFyLmZyb21Kc29uKCR3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oS0VZKSk7XG4gICAgICAgIHJldHVybiB1c2VyQXV0aC51c2VyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0VG9rZW4gPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc0F1dGhlbnRpY2F0ZWQoKSAmJiB0aGlzLmdldEN1cnJlbnRVc2VyKCkpe1xuICAgICAgICBsZXQgdXNlckF1dGggPSBhbmd1bGFyLmZyb21Kc29uKCR3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oS0VZKSk7XG4gICAgICAgIHJldHVybiB1c2VyQXV0aC52YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0VXNlckJ5RW1haWwgPSAoZW1haWwpID0+IHtcbiAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICRodHRwLmdldChBUElfVVJMICsgYD9lbWFpbD0ke2VtYWlsfWApLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZS5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBkZWZlci5yZXNvbHZlKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlZmVyLnJlamVjdCgpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGRlZmVyLnJlamVjdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBkZWZlci5wcm9taXNlO1xuICAgIH07XG5cbiAgICB0aGlzLmNyZWF0ZVVzZXIgPSAodXNlcikgPT4ge1xuXG4gICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuXG4gICAgICB0aGlzLmdldFVzZXJCeUVtYWlsKHVzZXIuZW1haWwpLnRoZW4oKCkgPT4ge1xuICAgICAgICBkZWZlci5yZWplY3QoKTtcbiAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgJGh0dHAucG9zdChBUElfVVJMLCB1c2VyKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLCBhbmd1bGFyLnRvSnNvbihyZXNwb25zZS5kYXRhKSk7XG4gICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnQVVUSCcsIHRydWUpO1xuICAgICAgICAgIGRlZmVyLnJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGRlZmVyLnByb21pc2U7XG4gICAgfTtcblxuICAgIHRoaXMuY29ubmVjdCA9IChlbWFpbCwgcHdkKSA9PiB7XG5cbiAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG4gICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgbG9naW4gOiBlbWFpbCxcbiAgICAgICAgcGFzc3dvcmQ6IHB3ZFxuICAgICAgfVxuICAgICAgJGh0dHAucG9zdChBUElfVVJMLCBkYXRhKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2UuZGF0YSkge1xuICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLCBhbmd1bGFyLnRvSnNvbihyZXNwb25zZS5kYXRhKSk7XG4gICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnQVVUSCcsIHRydWUpO1xuICAgICAgICAgIGRlZmVyLnJlc29sdmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZlci5yZWplY3QoKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGRlZmVyLnJlamVjdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBkZWZlci5wcm9taXNlO1xuICAgICAgLyokaHR0cC5nZXQoQVBJX1VSTCArIGA/ZW1haWw9JHtlbWFpbH0mcGFzc3dvcmQ9JHtwd2R9YCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oS0VZLCBhbmd1bGFyLnRvSnNvbihyZXNwb25zZS5kYXRhWzBdKSk7XG4gICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnQVVUSCcsIHRydWUpO1xuICAgICAgICAgIGRlZmVyLnJlc29sdmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZlci5yZWplY3QoKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGRlZmVyLnJlamVjdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBkZWZlci5wcm9taXNlOyovXG4gICAgfTtcblxuICAgIHRoaXMuZGlzY29ubmVjdCA9ICgpID0+IHtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oS0VZKTtcbiAgICAgICRyb290U2NvcGUuJGVtaXQoJ0FVVEgnLCBmYWxzZSk7XG4gICAgfTtcblxuICB9KTsiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vYXV0aCcpO1xucmVxdWlyZSgnLi91c2VycycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwJylcblxuICAuc2VydmljZSgnVXNlcnNTZXJ2aWNlJywgZnVuY3Rpb24gKCRxLCAkaHR0cCwgQXV0aFNlcnZpY2UpIHtcbiAgICAnbmdJbmplY3QnO1xuXG4gICAgY29uc3QgQVBJX1VSTCA9ICdodHRwOi8vYXBpLnByb2plY3Qtc3ltZm9ueS5mci91c2Vycy9saXN0JztcblxuICAgIHRoaXMuZ2V0VXNlcnMgPSAoKSA9PiB7XG4gICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuICAgICAgdmFyIHRva2VuID0gQXV0aFNlcnZpY2UuZ2V0VG9rZW4oKTtcbiAgICAgICRodHRwLmdldChBUElfVVJMLCB7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnWC1BdXRoLVRva2VuJzogdG9rZW5cbiAgICAgICB9LFxuICAgICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgZGVmZXIucmVzb2x2ZShyZXNwb25zZS5kYXRhKTtcbiAgICAgIH0pLmNhdGNoKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBkZWZlci5yZWplY3QocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGRlZmVyLnByb21pc2U7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0VXNlciA9IChpZCkgPT4ge1xuICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcblxuICAgICAgJGh0dHAuZ2V0KEFQSV9VUkwgKyBgLyR7aWR9YCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgZGVmZXIucmVzb2x2ZShyZXNwb25zZS5kYXRhKTtcbiAgICAgIH0pLmNhdGNoKChyZXNwb25zZSkgPT4ge1xuICAgICAgICBkZWZlci5yZWplY3QocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGRlZmVyLnByb21pc2U7XG4gICAgfTtcbiAgfSk7Il19
