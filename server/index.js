var Xray = require('x-ray');
var x = Xray();
var prof= "restaurants"

x('https://www.yelp.com/search?find_desc={prof}&find_loc=Los+Angeles,+CA', 'div.search-result', [{
  address: 'address',
  phone: 'span.biz-phone'
}])(function(err, results){
  console.log(results)
})
