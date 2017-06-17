function cutArticleTable() {
    return {
        restrict: 'E',
        templateUrl: 'public/cut/templates/cut-article-table.html',
        scope: {},
        bindToController: {
            articleList: "=",
        },
        controller: function ($scope, ArticleFactory) {
            var ctrl = this;

            ctrl.dimensionSelectionModalContent = {
                modalTitle: 'Inserimento larghezza e/o lunghezza Giacenza Virtuale',
                modalId: 'dimensionselected',
                modalClass: 'modal fade',
                article: {},
                index: null,
            };

            ctrl.cutArticleDeletionModalContent = {
                modalTitle: 'Cancellazion dell\'articolo dell\'ordine di taglio',
                modalId: 'cutarticledeletion',
                modalClass: 'modal fade',
                modalBody: 'L\'articolo sara cancellato dall\'ordine di taglio e da ogni parte del sistema',
                article: {},
                index: null,
            };

            ctrl.selectArticle = function (article, index) {
                var articleCopy = Object.assign({}, article);
                ctrl.dimensionSelectionModalContent.article = articleCopy;
                if (ctrl.dimensionSelectionModalContent.article.lunghezzaAssegnata) {
                    ctrl.dimensionSelectionModalContent.article.lunghezzaAssegnata = articleCopy.lunghezzaAssegnata.toString();
                }
                if (ctrl.dimensionSelectionModalContent.article.larghezzaAssegnata) {
                    ctrl.dimensionSelectionModalContent.article.larghezzaAssegnata = articleCopy.larghezzaAssegnata.toString();
                }
                ctrl.cutArticleDeletionModalContent.article = article;
                ctrl.dimensionSelectionModalContent.index = index;
                ctrl.cutArticleDeletionModalContent.index = index;
                console.log("selecteArticle",article, index);
            };

            ctrl.assignDimension = function (article, index) {
                ArticleFactory.updateArticle({article: article})
                    .then(function (resp) {
                        console.log(resp);
                        ctrl.articleList[index] = article;
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                console.log("assignDimensione", ctrl.articleList[index], index);
            };

            ctrl.deleteCutArticle = function (article, index) {
                ArticleFactory.deleteArticle(article._id)
                    .then(function (resp) {
                        console.log(resp);
                        ctrl.articleList.splice(index, 1);
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            }
        },
        controllerAs: 'cutArticleTableCtrl',
    };
}

angular
    .module('store')
    .directive('cutArticleTable', cutArticleTable);
