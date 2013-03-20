using System;
using System.Runtime.Serialization;
using System.Web.Services;
using System.Collections.Generic;

namespace WebProject
{
	/*{
	 	"queryByCriteriaRequest": {
	 		"criteria": [
	 			{
	 			"sourceSystem":"1",
	 			"sourceEntityType":"4"
	 			}
	 			],
	        "name":"query"
 			}
	}*/
	[DataContract]
	public class QueryByCriteriaRequest
	{
		[DataMember(Name="criteria")]
		public Criteria criteria { get; set; }
		[DataMember(Name="name")]
		public string name {get; set;}
	}
}

