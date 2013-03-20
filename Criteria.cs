using System;
using System.Runtime.Serialization;
using System.Collections.Generic;
using System.Web.Services;

namespace WebProject
{

	/*{
	 	"criteria": {
	 	"sourceSystem":["1"],
	 	"sourceEntityType":["4"]
	 	}
	 }*/

	[DataContract]
	public class Criteria
	{
		[DataMember(Name="sourceSystem")] 
		public string sourceSystem { get; set; }
		[DataMember(Name="targetSystem")] 
		public string targetSystem { get; set; }
		[DataMember(Name="sourceEntityType")] 
		public string sourceEntityType { get; set; }
		[DataMember(Name="targetEntityType")] 
		public string targetEntityType { get; set; }

		public Criteria ()
		{

		}

	}
}

