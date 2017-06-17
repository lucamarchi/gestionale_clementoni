/**
 * Created by luca on 24/04/17.
 */

module.exports = {

    deleteDuplicates: function(array) {
        var tmpArray = [];
        array.forEach(function(currElem) {
            var check = true;
            for (var i=0; i<tmpArray.length; i++) {
                if (tmpArray[i].numeroCollo == currElem.numeroCollo) {
                    check = false;
                }
            }
            if (check) {
                tmpArray.push(currElem);
            }
        });
        return tmpArray;
    },

    mergeElemArray: function(array1,array2) {
        var merged = array1;
        array2.forEach(function(elem) {
           merged.push(elem);
        });
        return merged;
    }

};