using System;
using System.Runtime.Serialization;
using System.Web.Services;

namespace WebProject
{
	/*{"updateRelationship":{
		 "source": {
		 	"connections":[],
		 	"id":114,
		 	"sourceSystem":1,
		 	"entityType":4,
		 	"name":"Joel Bergman"
	 	},
	 	"dest": {
	 		"connections":[],
	 		"id":173,
	 		"sourceSystem":2,
	 		"entityType":4,
	 		"name":"joel.bergman@panderasystems.com"
	 	},
	 	"relationshipType":1
	 	}
 	}*/

	[DataContract]
	public class UpdateRelationshipRequest
	{
		[DataMember(Name="source")]
		public SourceEntity source;
		[DataMember(Name="dest")]
		public SourceEntity dest;
		[DataMember(Name="relationshipType")]
		public int relationshipType = -1;

	}
}

