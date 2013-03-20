function partial(func /*, 0..n args */) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var allArguments = args.concat(Array.prototype.slice.call(arguments));
    return func.apply(this, allArguments);
  };
}
//Done: Add randomized category driven data to fill columns e.g. Hospital category of data: department,item category, unit of measure	
function getRandomBetween(low,high)
{
	var iterr = 1;
	var maxi = 1500;
	var x=1;
	
	while (iterr < maxi && (x > high || x < low))
	{
		x = Math.floor(Math.random()*(high+1));
		iterr=iterr+1;
	}
	if(x<low){alert('low result '+x+' after'+iterr+' tries high:'+high+' low:'+low)};
	if(x>high){alert('high result '+x+' after'+iterr+' tries high:'+high+' low:'+low)};
	
	return x;
}

function getRandomDataFromList(list,options)
{
	return data_lists[list][Math.floor(Math.random()*data_lists[list].length+1)-1];
	//Math.floor(Math.random()*data_lists[list].length+1)-1
	//getRandomBetween(1,data_lists[list].length) // doesn't work well
}