(function(angular){
    'use strict';
    var app = angular.module('cards.services', ['ngResource']);

    app.factory('Audiences', ['$resource', function($resource){
        return $resource('/cards/api/audience/:id',
            {'id': '@id'});
    }]);

    app.factory('Axes', ['$resource', function($resource){
        return $resource('/cards/api/axis/:id',
            {'id': '@id'});
    }]);

    app.factory('Cards', ['$resource', function($resource){
        return $resource('/cards/api/cards/:id',
            {'id': '@id'},
            {'update': {method: 'PUT'}});
    }]);

    app.factory('Images', ['$resource', 'Upload', function($resource, Upload){
        var img_file = $resource('/cards/api/images/:id',
            {'id': '@id'});

        img_file.upload = function (file, description) {
            return Upload.upload({
                url: '/cards/api/images',
                data: {
                    name: file.name,
                    image: file,
                    description: description
                },
                arrayKey: '',
            });
        };
        return img_file;
    }]);

    app.factory('CardFile', ['$resource', 'Upload', function($resource, Upload){
        var card_file = $resource('/cards/api/card-file/:id',
           {'id' : '@id'},
           {
               'update': {'method': 'PUT'},
               'patch': {'method': 'PATCH'}
           });

        card_file.upload = function(file) {
           return Upload.upload({
               url: '/cards/api/card-file',
               data: {
                   name: file.name,
                   file: file
               },
               arrayKey: '',
           });
        };
        return card_file;
   }]);

    app.factory('Likes', ['$resource', function($resource){
        return $resource('/cards/api/likes/:id',
            {'id': '@id'});
    }]);

    app.factory('Tags', ['$resource', function($resource){
        return $resource('/cards/api/tags/:id',
            {'id': '@id'});
    }]);

    app.factory('YouTubeEmbeds', ['$resource', function($resource){
        return $resource('/cards/api/youtube_embeds/:id',
            {'id': '@id'});
    }]);

})(window.angular);
