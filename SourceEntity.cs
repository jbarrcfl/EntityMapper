using System;
using System.Runtime.Serialization;
using System.Collections.Generic;

namespace WebProject
{
	[DataContract]
	public class SourceEntity
	{
		//				"id": "104",
		//				"name": "Alistair MacGowan",
		//				"sourceSystem": "1",
		//				"entityType": "4"

		[DataMember(Name="id")]
		public int id { get; set; }
		[DataMember(Name="sourceSystem")]
		public int sourceSystem { get; set; }
		[DataMember(Name="entityType")]
		public int entityType { get; set; }
		[DataMember(Name="name")]
		public string name { get; set; }
		[DataMember(Name="connections")]
		public List<SourceEntity> connections = new List<SourceEntity>();

		public SourceEntity ()
		{
		}

		public SourceEntity (int id, int sourceSystem, int entityType, string name)
		{
			this.id = id;
			this.sourceSystem = sourceSystem;
			this.entityType = entityType;
			this.name = name;
		}
		
	}
}

