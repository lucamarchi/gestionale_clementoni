function StockController ($scope, StockFactory, features) {
    var ctrl = this;
	ctrl.monster = [];
	ctrl.features = features;
	ctrl.getStocks = function () {
		StockFactory.getStocks()
            .then (function (resp) {
                console.log(resp);
				var stocks = resp.data.stocks;
				ctrl.monster = StockFactory.createMapStocks(stocks);
				console.log("MAP", ctrl.monster);
				console.log("STOCKS", stocks);
			})
			.catch(function(err) {
				console.log(err);
			});
    };
	
	ctrl.getStocks();
    
    ctrl.materialArray = [];
    ctrl.typeArray= [];
    ctrl.spessorArray = [];
    ctrl.larghArray = [];
    
    ctrl.includeVal = function(val, array) {
        var i = array.indexOf(val);
        if (i > -1) {
            array.splice(i, 1);
        } else {
            array.push(val);
        }
        console.log(array);
    }
	
//	ctrl.deleteProduct = function (product, index1, index2,index3, index4, index5) {
//		console.log("index1" , index1, "  index2 ", index2, "  index3 ",index3, "  index4 ", index4,  "  index5 ", index5);
//			StockFactory.resource().delete(
//				{
//					id:product._id
//				},
//				function(resp){
//					console.log(resp);
//					if(ctrl.monster[index1].lung == 1){
//						ctrl.monster.splice(index1,1);
//					}
//					else if (ctrl.monster[index1].value[index2].lung == 1){
//						ctrl.monster[index1].value.splice(index2,1);
//						ctrl.monster[index1].lung--;
//					}
//					else if (ctrl.monster[index1].value[index2].value[index3].lung == 1){
//						ctrl.monster[index1].value[index2].value.splice(index3,1);
//						ctrl.monster[index1].value[index2].lung--;
//						ctrl.monster[index1].lung--;
//					}
//					else if (ctrl.monster[index1].value[index2].value[index3].value[index4].lung == 1){
//						ctrl.monster[index1].value[index2].value[index3].value.splice(index4,1);
//						ctrl.monster[index1].value[index2].value[index3].lung--;
//						ctrl.monster[index1].value[index2].lung--;
//						ctrl.monster[index1].lung--;
//					}
//					else{
//						ctrl.monster[index1].value[index2].value[index3].value[index4].value.splice(index5,1);
//						ctrl.monster[index1].value[index2].value[index3].value[index4].lung--;
//						ctrl.monster[index1].value[index2].value[index3].lung--;
//						ctrl.monster[index1].value[index2].lung--;
//						ctrl.monster[index1].lung--;
//					}
//				},
//				function(err){
//					console.log(err);
//				}
//			);
//	}
//	
//	ctrl.openProduct = function (product) {
//		ctrl.product = product;
//	}
//	
//	ctrl.updateProduct = function (product) {
//		StockFactory.update({
//			id:product._id
//		},
//		product,
//		function(resp){
//			console.log(resp);
//		},
//		function(err){
//			console.log(err);
//		});
//	}
//	
//	
//    ctrl.materialIncludes = [];
//    
//    ctrl.includeMaterial = function(material) {
//        var i = $.inArray(material, ctrl.materialIncludes);
//        if (i > -1) {
//            ctrl.materialIncludes.splice(i, 1);
//        } else {
//            ctrl.materialIncludes.push(material);
//        }
//    }
//    
//    ctrl.materialFilter = function(m2p) {
//        if (ctrl.materialIncludes.length > 0) {
//            if ($.inArray(m2p.key, ctrl.materialIncludes) < 0)
//                return;
//        }
//        return m2p;
//    }
//	
//	ctrl.typeIncludes = [];
//    
//    ctrl.includeType = function(type) {
//        var i = $.inArray(type, ctrl.typeIncludes);
//        if (i > -1) {
//            ctrl.typeIncludes.splice(i, 1);
//        } else {
//            ctrl.typeIncludes.push(type);
//        }
//    }
//    
//    ctrl.typeFilter = function(t2p) {
//        if (ctrl.typeIncludes.length > 0) {
//            if ($.inArray(t2p.key, ctrl.typeIncludes) < 0)
//                return;
//        }
//        return t2p;
//    }
//	
//	ctrl.spessorIncludes = [];
//    
//    ctrl.includeSpessor = function(spessor) {
//        var i = $.inArray(spessor, ctrl.spessorIncludes);
//        if (i > -1) {
//            ctrl.spessorIncludes.splice(i, 1);
//        } else {
//            ctrl.spessorIncludes.push(spessor);
//        }
//    }
//    
//    ctrl.spessorFilter = function(s2p) {
//        if (ctrl.spessorIncludes.length > 0) {
//            if ($.inArray(s2p.key, ctrl.spessorIncludes) < 0)
//                return;
//        }
//        return s2p;
//    }
//	
//	ctrl.largIncludes = [];
//    
//    ctrl.includeLarg = function(larg) {
//        var i = $.inArray(larg, ctrl.largIncludes);
//        if (i > -1) {
//            ctrl.largIncludes.splice(i, 1);
//        } else {
//            ctrl.largIncludes.push(larg);
//        }
//    }
//    
//    ctrl.largFilter = function(l2p) {
//        if (ctrl.largIncludes.length > 0) {
//            if ($.inArray(l2p.key, ctrl.largIncludes) < 0)
//                return;
//        }
//        return l2p;
//    }
//	
//	ctrl.prepareDeleteStock = function(product,index1,index2,index3,index4,index5){
//		ctrl.product = product;
//		ctrl.index1 = index1;
//		ctrl.index2 = index2;
//		ctrl.index3 = index3;
//		ctrl.index4 = index4;
//		ctrl.index5 = index5;
//	}
    
    
};

angular
    .module('store')
    .controller('StockController', ['$scope', 'StockFactory', 'features', StockController]);