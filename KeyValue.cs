using System;
using System.Runtime.Serialization;

namespace WebProject
{
	[DataContract]
	public class KeyValue
	{
		[DataMember(Name="id")] 
		public int id { get; set; }
		[DataMember(Name="value")] 
		public string value { get; set; }

		public KeyValue ()
		{
		}

		public KeyValue (int id, string value)
		{
			this.id = id;
			this.value = value;
		}
		
	}
}

