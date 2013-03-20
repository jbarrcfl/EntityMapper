//TODO: More robust formatting
//      1. Remove all formatting
// 		2. Reapply formatting based on column "data"

function formatData(col,format,showcents)
{
	switch(format)
	{
		case 1:
		//Format currency
		
		//Select td's and fill will random value each'
		var intds = $('#mockupinput input[id*="infield'+col+'"]');
		var x;
		
		for(i=0;i<intds.length;i++)
		{
			$(intds[i]).val(formatToCurrency($(intds[i]).val(),showcents));
			$(intds[i]).change();
		}
		break;
		
		case 2:
		var intds = $('#mockupinput input[id*="infield'+col+'"]');
		
		for(i=0;i<intds.length;i++)
		{
			$(intds[i]).val(formatToPercent($(intds[i]).val(),showcents));
			$(intds[i]).change();
		}
		
		break;
		
		default:
		alert('No format specified');
		break;
	}
}

function formatToPercent(num,showdecimals)
{
	var retVal;
	num = num.replace('%','');
	retVal = num+'%';
	return retVal;
}

function formatToCurrency(num,showcents)
{
	var retVal;
	num = num.toString().replace(/\$|\,/g, '');
	if (isNaN(num)) num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if (cents < 10) cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
	num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
	retVal =  (((sign) ? '' : '-') + '$' + num );
	return showcents?retVal+ '.' + cents:retVal;
}