using System;
using System.Runtime.Serialization;

namespace WebProject
{
	[DataContract]
	public class EntityRelationship
	{
		[DataMember(Name="srcID")] //Child in DB
		public int srcID { get; set; }
		[DataMember(Name="targetID")] //Parent in DB
		public int targetID { get; set; }
		[DataMember(Name="relationshipType")]
		public int relationshipType { get; set; }
		[DataMember(Name="relationshipTypeDesc")]
		public string relationshipTypeDesc { get; set; }

		public EntityRelationship ()
		{
		}

		public EntityRelationship (int srcID, int targetID, int relationshipType,string relationshipTypeDesc)
		{
			this.srcID = srcID;
			this.targetID = targetID;
			this.relationshipType = relationshipType;
			this.relationshipTypeDesc = relationshipTypeDesc;
		}
		
	}
}

