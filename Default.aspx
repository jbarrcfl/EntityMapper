<%@ Page Language="C#" Inherits="WebProject.Default" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head runat="server">
	<title>Default</title>
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.0/themes/base/jquery-ui.css" />
	<script src="jquery-1.9.1.min.js"></script>
	<script src="/js/jquery-ui-1.10.0.custom.min.js"></script>
	<script src="/js/jquery.json-2.4.min.js"></script>
	<script src="/js/data_hospital.js"></script>
	<script src="/js/data_regions.js"></script>
	<script src="/js/narytree.js"></script>
	<script src="/js/generatedata.js"></script>
	<script src="/js/formatting.js"></script>
	
	<script type="text/javascript">
	$(document).ready(function(){

	$("#dialog-confirm").hide();
	$("#dialog-data").hide();
	$("#dialog-format").hide();
	
	function createfunction()
	{	
		if($('#mockuptable').length>0)
		{
			$( "#dialog-confirm" ).dialog({
		      resizable: false,
		      height:140,
		      modal: true,
		      buttons: {
		        "Delete all items": function() {
		          $("#mockuptable").remove();
		          $("#contenttable").remove();
		          createTable();
		          $( this ).dialog( "close" );
		        },
		        Cancel: function() {
		        	// Do not create table
		          $( this ).dialog( "close" );
		        }
		      }
		    });
	    }
	    else {createTable();}
	}
	
	function createTable()
	{
		var strContent;
		var rows,numrows,numcols;
		var cols;
		
		//Gather Input
		numrows = $('#numrows').val();
		numcols = $('#numcols').val();
		
		//Draw table in the mockup area with specified rows and columns and header yay or nay
		//Create table
		$('<table id="mockuptable"></table>').appendTo('#mockupcontent');
		
		$('<table id="contenttable"></table>').appendTo('#mockupinput');
		
		//Add utilities to grid
		//Add row
		$('<tr id="upperUtilRow"></tr>').appendTo('#contenttable');
		for(k=0;k<numcols;k++)
		{
			$("<td id='util"+k+"' ><img id='data"+k+"' src='button - record.png' width='15' height='15' onclick='utilData(+"+k+")' /><img id='data"+k+"' src='tool-box.png' width='15' height='15' onclick='utilFormat(+"+k+")' /></td>").appendTo('#upperUtilRow');
		}
		
		// Mockup Table
		for(i=0;i<numrows;i++)
		{
			//ApendTo each row
			$('<tr id="row'+i+'"></tr>').appendTo('#mockuptable');
			
			//alert('row'+i);
			
			//var curRowCols = rows[i].split(',');
			for(k=0;k<numcols;k++)
			{
				//ApendTo each column
				($('<td></td').attr('id',i+'col'+k)).appendTo('#row'+i);
				
				//$('<td id="'+i+'col'+k+'"></td>').appendTo('#row'+i);
			}
		}
		// Create Headers if headers are enabled
		if($('#headers').is(':checked'))
		{
			//TODO: Add header row to table instead of transforming top cells in to TH
			//Select only destination row0 not input inrow0
			$("tr[id*='row0'] td").each(function(index) {
			  var thisTD = this;
			  var newElement = $("<th></th>");
			  $.each(this.attributes, function(index) {
			    $(newElement).attr(thisTD.attributes[index].name, thisTD.attributes[index].value);
			  });
			  $(this).after(newElement).remove();
			});
		}
		
		// Input Table
		for(i=0;i<numrows;i++)
		{
			//ApendTo each row
			$('<tr id="inrow'+i+'"></tr>').appendTo('#contenttable tbody');
			
			//var curRowCols = rows[i].split(',');
			for(k=0;k<numcols;k++)
			{
				//ApendTo each column
				var x = $('<td></td').attr("id",i+'incol'+k);
				var y = $('<input></input>').attr({
					id: i+'infield'+k,
					type:'text',
					onchange:'updateInput('+i+','+k+',this.value)'
				});
				y.appendTo(x.appendTo('#inrow'+i));
			}
		}
		// Create Headers if headers are enabled
		if($('#headers').is(':checked'))
		{
			//TODO: Add header row to table instead of transforming top cells in to TH
			//Select only destination row0 not input inrow0
			$("tr[id*='inrow0'] td").each(function(index) {
			  var thisTD = this;
			  var newElement = $("<th></th>");
			  $.each(this.attributes, function(index) {
			    $(newElement).attr(thisTD.attributes[index].name, thisTD.attributes[index].value);
			  });
			  newElement.append($(this).children());
			  $(this).after(newElement).remove();
			});
		}
	};
	
	// Add create function call when the button is pushed
	$("#createbutton").click(function(){createfunction();});});
	
	function updateInput (row,col,value)
	{
		($('#'+row+'col'+col).empty()).append(value);
	}
	
	
	function fillColumnWithData(column,func)
	{
		var intds = $('#mockupinput input[id*="infield'+column+'"]');
		for(i=0;i<intds.length;i++)
		{
			x = func();
			$(intds[i]).val(x);
			$(intds[i]).change();
		}
	}
	
	function percentOfColumnData(cellVal,low,up)
	{
		return Math.floor((cellVal/100)*getRandomBetween(low,up));
	}
	
	function outputToJSON(tablename)
	{	
		var myTr = [];
		var myTable = [];
		var colName = '';
		
		if($('#'+tablename+' th').length > 0)
		{
			//TODO: has headers $("tr[id*='inrow0'] td")
			
			//Header row first
			/*$("#"+tablename+" th[id*='0col']").each(function(i, th) {
				colName = $(th).html();
			   	 myTable[colName] = [];
			   	 //alert(colName);
				$("#"+tablename+" td[id*='col"+i+"']").each(function(k, td) { 
					myTable[colName][k] = $(td).html();
					//alert($(td).html());
					});
			     });
			*/
			
			var tblhdr = $("#"+tablename+" tbody tr:first th").map(function(){ 
			return $(this).text(); }).get();
			var tbl = $("#"+tablename+" tbody tr:gt(0)").map(function(idx, el) 
			{ 
				var td = $('td',el);
				var obj = {id:idx+1};
				for(var i=0;i<tblhdr.length;i++)
				{
					obj[tblhdr[i]]= td.eq(i).text();
				} return obj;
			}).get();
			
			
			/*var output = '';
			for (property in myTable) {
			  output += property + ': ' + myTable[property]+'; ';
			}*/
			
			$('#data').val($.toJSON(tbl));
			console.log(JSON.stringify(myTable));
			
			//alert('headers '+$.toJSON(myTable));
			
		}
		else
		{
			//TODO: without headers
			var tbl = $('table#'+tablename+' tr').map(function() {
			  return $(this).find('td').map(function() {
			    return $(this).html();
			  }).get();
			}).get();
			
			alert($.toJSON(tbl));
		}
		//return retVal;
	}
	
	var aTree;
	function tableToTree(aTable)
	{
		//!!Parent child hierarchy is left to right value is last
		//Assume all columns but the final are p --> c 
		//1. Does node exist
		//2. Add Child, Add Parent, Get Parent, Get Children
		var aNode = new treeNode('root');
		
		aTree = new nTree(aNode);
		aTree.Root.addChild(new treeNode('Child 1'));
		aTree.Root.addChild(new treeNode('Child 2'));
		console.log(aTree.Search(new treeNode('Child 1')));
		
	}
	
	function fillDataTablesFromCat(aCat)
	 {
	  	$('#dataTableSelect').empty();
		for(i in dt=data_lists[aCat+'_dropdown'])
		{
			$('#dataTableSelect').append($("<option></option")
			.attr("value",dt[i].option)
			.text(dt[i].name));
		}
	  }
	
	function utilData(column)
	{
		  //Fill column select list with num columns
		  $('#dataColumnSelect').empty();
		  //alert( $('#mockupinput td[id^="0incol"]').length);
	       $('#mockupinput td[id^="1incol"]').each(function(index){   
			     if(index!=column)
			     {
				     $('#dataColumnSelect')
				         .append($("<option></option>")
				         .attr("value",index)
				         .text(index+1)); 
				 }
			});
			
			//Fill select list for data categories
			$('#dataCategorySelect').empty();
			for(cat in dl =data_lists.categories)
			{
				$('#dataCategorySelect').append($("<option></option")
				.attr("value",dl[cat].prefix)
				.text(dl[cat].name));
				$('#dataCategorySelect').change(function(){
					fillDataTablesFromCat($(this).find(':selected').val());
					});
			}
			$('#dataCategorySelect').change();
			
			
		 $( "#dialog-data" ).dialog({
	      resizable: true,
	      height:360,
	      modal: true,
	      buttons: {
	        "Randomize Column": function() {
			
	        //Gather input
	        var up,low,dataPercentOfCol,colSelected,dataCategoryCheckbox;
	        dataPercentOfCol = $("#dataPercentOfCol").is(':checked')? 1:0;
	        dataCategoryCheckbox = $("#dataCategory").is(':checked');
	        colSelected = $("#dataColumnSelect").val();
	        
	        up = $("#upperRange").val();
	        low  = $("#lowerRange").val();
	        
	        if(dataPercentOfCol) {var i=0; fillColumnWithData(column,partial(percentOfColumnData,$('#mockupinput input[id="'+(i++)+'infield'+colSelected+'"]').val(),low,up))}
	        else if(dataCategoryCheckbox) {fillColumnWithData(column,partial(getRandomDataFromList,$("#dataTableSelect").find(':selected').val()));}
	        else{fillColumnWithData(column,partial(getRandomBetween,low,up));}
	        
          	$( this ).dialog( "close" );
	        },
	        Cancel: function() {
	        	// Do not create table
	          $( this ).dialog( "close" );
	        }
	      }
	    });
	}
	function utilFormat(column)
	{
		 $( "#dialog-format" ).dialog({
	      resizable: true,
	      height:360,
	      modal: true,
	      buttons: {
	        "Format Column": function() {
	        
	        //Gather input
	        var format=0;
	        var showcents = false;
	        
	        format = $('#formatCurrencyCheckbox').is(':checked')? 1:0;
	        format = format==0? $('#formatPercentCheckbox').is(':checked')?2:-1 :format;
	      	showcents =$('#formatCurrencyShowCents').is(':checked');
	      	
	      	//alert(format);
         	formatData(column,format,showcents);
          	$( this ).dialog( "close" );
	        },
	        Cancel: function() {
	        	// Do no format
	          $( this ).dialog( "close" );
	        }
	      }
	    });
	}
	</script>
	
	<style>
	table, td, th
	{
		border:1px solid blue;
	}
	th
	{
		background-color: blue;
		color:white;
	}
	</style>
</head>
<body onload=''>
	
	
	<form id="form1" runat="server">
	</form>
	<div id="interfacecontrols">
		<div>
			<p>Add Table
			<br>Rows:<input id="numrows" type="text" value="2" />Header?<input id="headers" type="checkbox" value="1" />
			<br>Columns:<input id="numcols" type="text" value="3" />
			Data <input id="usedata" type="checkbox" value="1" /><textarea id="data"  rows="4" cols="50">test,how,it,works/n1,2,3,4/n5,6,7,8</textarea>
			<br><button id="createbutton" type="button">Create!</button></p>
			<br><button id="jsonbutton" type="button" onclick="outputToJSON('mockuptable');">To JSON</button></p>
		</div>
	</div>
	<div>
		<span id="mockupcontent"></span><span id="mockupinput"></span>
	</div>
	<div id="dialog-confirm" title="Remove current table?">
	  <p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>The current table will be lost.</p>
	</div>
	
	<div id="dialog-data" title="Update Data for this column?">
	  <p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>Dialog for data options</p>
	<p>
		<span>Upper Range:<input id='upperRange' type='text' value='12000000'/>Lower Range<input id='lowerRange' type='text' value='1000000'/></span>
	    <!--TODO Random % of another column -->
	    <br>Percent of Column<select id="dataColumnSelect"></select><input id='dataPercentOfCol' type='checkbox' value='1'/>
	    <br>Data Category<select id="dataCategorySelect"></select><input id='dataCategory' type='checkbox' value='1'/>
	    <br>Data Table<select id="dataTableSelect"></select>
	</p>
	</div>
	
	<div id="dialog-format" title="Update Data for this column?">
	  <p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>Dialog for data options</p>
	<p>
	Currency:<input id='formatCurrencyCheckbox' type='checkbox' value='1'/>
	<br>Percent:<input id='formatPercentCheckbox' type='checkbox' value='2'/>
	<br>Show Decimals:<input id='formatCurrencyShowCents' type='checkbox' value='1'/>
	</p>
	</div>
</body>
</html>
