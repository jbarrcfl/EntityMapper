function nTree(aNode)
{
	this.Root = aNode;
	this.Search = function (aNode)
	{
		 	var retVal = new treeNode('retVal');
		 	
		 	retVal = $(this.Root).Value == aNode.Value? Root:retVal;
		 	
		 	$(this.Root.Children).each(function(i){
			if(this.Value == aNode.Value)
			{
				retVal = this;
				console.log('found:'+aNode.Value+' this:'+this.Value);
				return this;
			}
			
			return retVal;
		})
	}
}

function treeNode(aVal)
{
	this.Value = aVal;
	this.Children = new Array();
	this.addChild = function (aNode)
	{
		this.Children.push(aNode);
		return aNode;
	}
}

function PrintTree(aTree)
{
	console.log('Root:'+aTree.Root.Value);
	$(aTree.Root).each(function(i){
		$(this.Children).each(function(k){
		console.log('['+i+']['+k+']'+this.Value);
		})
	})
	return true;
}