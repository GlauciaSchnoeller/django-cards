(function(angular){
    'use strict';
    var app = angular.module('cards.controllers', ['ngCookies']);

    app.controller('CardsListCtrl', ['$scope', '$routeParams', '$http', 'Audiences', 'Axes', 'Cards', 'Likes', 'Tags', 'YouTubeEmbeds',
        function ($scope, $routeParams, $http, Audiences, Axes, Cards, Likes, Tags, YouTubeEmbeds) {

            /* Services bindings */
            $scope.audiences = Audiences.query();
            $scope.cards = {};
            $scope.cards.all = Cards.query();
            $scope.axes = Axes.query();
            $scope.tags = Tags.query();

            $scope.show_filter_options = false;
            $scope.keyword = '';
            $scope.filter = {};
            $scope.filter.keyword = '';
            $scope.filter.audience = '';
            $scope.filter.axis = '';
            $scope.filter.status = '';
            $scope.filter.tags = [];

            /* Because modulo operation is **very wrongly** defined in JS for negative numbers. */
            function safe_mod (m, n) {
                return ((m % n) + n) % n;
            }

            function get_slides_row (arr, start) {
                if (arr.length < 3)
                    return arr;
                var new_row = [];
                for (let i = 0; i < 3; i++)
                    new_row[i] = arr[safe_mod(i + start, arr.length)];
                return new_row;
            }

            $scope.certified_base_slide = 0;
            $scope.community_base_slide = 0;
            $scope.certified_slides_down = function () {
                $scope.slider.certified = get_slides_row($scope.cards.certified, --$scope.certified_base_slide);  
            }
            $scope.certified_slides_up = function () {
                $scope.slider.certified = get_slides_row($scope.cards.certified, ++$scope.certified_base_slide);
            }
            $scope.community_slides_down = function () {
                $scope.slider.community = get_slides_row($scope.cards.community, --$scope.community_base_slide);
            }
            $scope.community_slides_up = function () {
                $scope.slider.community = get_slides_row($scope.cards.community, ++$scope.community_base_slide);
            }

            function filter_by_status () {
                $scope.cards.certified = $scope.cards.all.slice(0).
                    filter(function (elem) {
                        return elem.is_certified;
                    });
                $scope.cards.community = $scope.cards.all.slice(0).
                    filter(function (elem) {
                        return !elem.is_certified;
                    });
            }

            $scope.slider = {};          

            $scope.blank_filters = true;

            $scope.get_cards = function () {
                $scope.filter.keyword = $scope.keyword;
                $scope.blank_filters =
                    $scope.filter.keyword === '' &&
                    $scope.filter.audience === '' &&
                    $scope.filter.axis === '' &&
                    $scope.filter.status === '' &&
                    $scope.filter.tags.length === 0;
                Cards.query({
                    audience__name: $scope.filter.audience,
                    axis__name: $scope.filter.axis,
                    is_certified: $scope.filter.status,
                    search: $scope.filter.keyword,
                    tags__name: $scope.filter.tags
                }).$promise.then(function (data) {
                    $scope.cards.all = data;
                    filter_by_status();
                    $scope.certified_base_slide = 0;
                    $scope.community_base_slide = 0;
                    $scope.slider.certified = get_slides_row($scope.cards.certified, $scope.certified_base_slide);
                    $scope.slider.community = get_slides_row($scope.cards.community, $scope.community_base_slide); 
                });
            };

            /* Tags */
            $scope.tag = '';
            if ($routeParams.tag) {
                $scope.filter.tags.push($routeParams.tag);
                $scope.get_cards();
            } 
            $scope.insert_tag = function (tag) {
                if (tag !== '' && $scope.filter.tags.indexOf(tag) == -1) {
                    $scope.filter.tags.push(tag);
                    $scope.get_cards();
                }
                $scope.tag = '';                
            };
            $scope.remove_tag = function (index) {
                $scope.filter.tags.splice(index, 1);
                $scope.get_cards();
            };

            $scope.cards.all.$promise.then(function () {
                filter_by_status();
                $scope.slider.certified = get_slides_row($scope.cards.certified, 0);
                $scope.slider.community = get_slides_row($scope.cards.community, 0);
            });    
            
            $scope.$watchCollection('filter', function(newVal, oldVal) {
                $scope.get_cards();
            });
        }
    ]);

    app.controller('CardDetailCtrl', ['$scope', '$routeParams', '$http', 'Cards', 'Likes', 'YouTubeEmbeds',
        function ($scope, $routeParams, $http, Cards, Likes, YouTubeEmbeds) {
            $scope.card_id = $routeParams.cardId; 
            $scope.card = Cards.get({id: $scope.card_id});
            
            // $scope.is_empty = function (obj){
            //     return obj && Object.keys(obj).length === 0;
            // };

            $scope.like = function () {
                Likes.save({card: $scope.card_id}).$promise.then(function(response) {
                    $scope.card.user_liked = response.pk;
                    $scope.card.likes += 1;
                });
            };
            $scope.unlike = function () {
                Likes.delete({id: $scope.card.user_liked}).$promise.then(function() {
                    $scope.card.user_liked = null;
                    $scope.card.likes -= 1;
                });
            };
        }
    ]); 

    app.controller('NewCardCtrl', ['$scope', '$routeParams', '$http', 'Audiences', 'Axes', 'Cards', 'Images', 'Likes', 'Tags', 'TinymceOptions', 'YouTubeEmbeds',
        function ($scope, $routeParams, $http, Audiences, Axes, Cards, Images, Likes, Tags, TinymceOptions, YouTubeEmbeds) {
            $scope.card = {is_certified: false};
            $scope.card.audience = {};
            $scope.card.axis = {};
            $scope.editing_mode = false;

            $scope.audiences = Audiences.query();
            $scope.axes = Axes.query();
            $scope.tags = Tags.query();

            $scope.tinymceOptions = TinymceOptions;

            $scope.card.tags = [];
            $scope.new_tag = function (new_tag) {
                return {
                    name: new_tag
                };
            };

            $scope.card.authors = [];
            $scope.add_author = function () {
                $scope.card.authors.push({author_name: '', author_description: ''});
            }

            $scope.create_card = function () {
                Cards.save($scope.card).$promise.then(function (response) {
                    console.log(response);
                    $scope.card = {is_certified: false};
                }).catch(function(error) {
                    console.log(error);
                });
            }


            // Cards.update({
            //     id: 76,
            //     audience: {
            //         id: 2
            //     },
            //     axis: {
            //         id: 3
            //     },
            //     is_certified: true,
            //     tags: ['estações', 'outono', 'teste'],
            //     text: 'A estação da renovação!',
            //     title: 'É assim que se curte o outono - teste por XHR (atualizado)'
            //     }).$promise.then(function (data) {
            //     console.log(data);
            //     console.log("Sucesso!");
            //     }).catch(function (error) {
            //     console.log(error);
            // });

            $scope.upload = function (file) {
                if (file) {
                    Images.upload(file, 'Teste').then(function (response) {
                        console.log(response);
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            }
        }
    ]);

    app.controller('EditCardCtrl', ['$scope', '$routeParams', '$http', 'Audiences', 'Axes', 'Cards', 'Images', 'Likes', 'Tags', 'TinymceOptions', 'YouTubeEmbeds',
        function ($scope, $routeParams, $http, Audiences, Axes, Cards, Images, Likes, Tags, YouTubeEmbeds) {
            $scope.card_id = $routeParams.cardId;
            $scope.card = Cards.get({id: $scope.card_id});
            $scope.editing_mode = true;

            $scope.audiences = Audiences.query();
            $scope.axes = Axes.query();
            $scope.tags = Tags.query();
        }])

})(window.angular);
