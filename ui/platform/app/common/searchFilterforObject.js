angular.module('searchFilter',[])
.filter('custom', function() {
 return function(input, search) {
   if (!input) return input;
   if (!search) return input;
   var expected = ('' + search).toLowerCase();
   var result = {};
   angular.forEach(input, function(value, key) {
     var actual = ('' + value.display_name).toLowerCase();
     if (actual.indexOf(expected) !== -1) {
       result[key] = value;
     }
   });
   return result;
 }
});