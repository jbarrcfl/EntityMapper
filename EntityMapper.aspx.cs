
using System;
using System.Web;
using System.Web.UI;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Collections.Generic;

namespace WebProject
{
	public partial class EntityMapper : System.Web.UI.Page
	{

		static IDbConnection aConn;
		static string aConnStr = "Server=development.panderasystems.com;Database=EntityMgt;User ID=jbarr;Password=r3c0v3ry!;";

		[WebMethod]
		public static string GetSourceEntities (int sourceSystem, int entityType)
		{
			string retVal = "";
			using (aConn = new SqlConnection(aConnStr)) {
				aConn.Open();
				using (IDbCommand dbcmd = aConn.CreateCommand()) {
					string sql ="SELECT Entity_ID, Entity_ShortDesc FROM ent.vwEntity WHERE Entity_Type_ID = "+entityType+" AND Source_System_ID= "+sourceSystem;
					dbcmd.CommandText = sql;
					using (IDataReader reader = dbcmd.ExecuteReader()) {
						retVal = "[";
						int i=0;
						while(reader.Read()) {
							if(i>0) retVal +=",";
							string anID = (string) reader["Entity_ID"].ToString();
							string aName = (string) reader["Entity_ShortDesc"].ToString();
							retVal += "{\"id\":\""+anID+"\", \"name\":\""+aName+"\"}";
							i++;
						}
						retVal += "]";
					}
				}
			}
			return retVal;
		}

		[WebMethod]
		public static List<SourceEntity> QuerySourceEntities (int sourceSystem, int sourceEntityType)
		{
			List<SourceEntity> retVal = new List<SourceEntity>();
			using (aConn = new SqlConnection(aConnStr)) {
				aConn.Open();
				using (IDbCommand dbcmd = aConn.CreateCommand()) {
					string sql ="SELECT Entity_ID, Entity_ShortDesc FROM ent.vwEntity WHERE Entity_Type_ID = "+sourceEntityType+" AND Source_System_ID= "+sourceSystem;
					dbcmd.CommandText = sql;
					using (IDataReader reader = dbcmd.ExecuteReader()) {

						while(reader.Read()) {

							int anID = Int16.Parse(reader["Entity_ID"].ToString());
							string aName = (string) reader["Entity_ShortDesc"].ToString();

							retVal.Add(new SourceEntity(anID,sourceSystem,sourceEntityType,aName));
						}
					}
				}
			}
			return retVal;
		}

		[WebMethod]
		public static List<SourceEntity> QuerySourceEntitiesCriteria(Criteria criteria)
		{ 
			List<SourceEntity> retVal = new List<SourceEntity>();
			// Turn criteria into SQL Query 

			using (aConn = new SqlConnection(aConnStr)) {
				aConn.Open();
				using (IDbCommand dbcmd = aConn.CreateCommand()) {
					string sql ="SELECT Entity_ID, Entity_ShortDesc FROM ent.vwEntity WHERE Entity_Type_ID = "+criteria.sourceEntityType+" AND Source_System_ID= "+criteria.sourceSystem;
					dbcmd.CommandText = sql;
					using (IDataReader reader = dbcmd.ExecuteReader()) {
						
						while(reader.Read()) {
							
							int anID = Int16.Parse(reader["Entity_ID"].ToString());
							string aName = (string) reader["Entity_ShortDesc"].ToString();
							
							retVal.Add(new SourceEntity(anID,Int32.Parse(criteria.sourceSystem),Int32.Parse(criteria.sourceEntityType),aName));
						}
					}
				}
			}
			return retVal;
		}

		[WebMethod]
		public static List<SourceEntity> QueryTargetEntitiesCriteria(Criteria criteria)
		{ 
			List<SourceEntity> retVal = new List<SourceEntity>();
			// Turn criteria into SQL Query 
			
			using (aConn = new SqlConnection(aConnStr)) {
				aConn.Open();
				using (IDbCommand dbcmd = aConn.CreateCommand()) {
					string sql ="SELECT Entity_ID, Entity_ShortDesc FROM ent.vwEntity WHERE Entity_Type_ID = "+criteria.targetEntityType+" AND Source_System_ID= "+criteria.targetSystem;
					dbcmd.CommandText = sql;
					using (IDataReader reader = dbcmd.ExecuteReader()) {
						
						while(reader.Read()) {
							
							int anID = Int16.Parse(reader["Entity_ID"].ToString());
							string aName = (string) reader["Entity_ShortDesc"].ToString();

							retVal.Add(new SourceEntity(anID,Int32.Parse (criteria.targetSystem),Int32.Parse(criteria.targetEntityType),aName));
						}
					}
				}
			}
			return retVal;
		}


		[WebMethod]
		public static List<SourceEntity> QueryTargetEntities (int sourceSystem, int entityType)
		{
			List<SourceEntity> retVal = new List<SourceEntity>();
			using (aConn = new SqlConnection(aConnStr)) {
				aConn.Open();
				using (IDbCommand dbcmd = aConn.CreateCommand()) {
					string sql ="SELECT Entity_ID, Entity_ShortDesc FROM ent.vwEntity WHERE Entity_Type_ID = "+entityType+" AND Source_System_ID= "+sourceSystem;
					dbcmd.CommandText = sql;
					using (IDataReader reader = dbcmd.ExecuteReader()) {
						
						while(reader.Read()) {
							
							int anID = Int16.Parse(reader["Entity_ID"].ToString());
							string aName = (string) reader["Entity_ShortDesc"].ToString();
							
							retVal.Add(new SourceEntity(anID,sourceSystem,entityType,aName));
						}
					}
				}
			}
			return retVal;
		}


		[WebMethod]
		public static List<EntityRelationship> QueryRelationships(Criteria criteria)
		{
	
			List<EntityRelationship> retVal = new List<EntityRelationship>();

			using (aConn = new SqlConnection(aConnStr)) {
				aConn.Open();
				using (IDbCommand dbcmd = aConn.CreateCommand()) {
					string sql ="SELECT Parent_Entity_ID srcID, Child_Entity_ID tarID,ENTITY_RELATIONSHIP_TYPE_ID relType,ENTITY_RELATIONSHIP_TYPE_SHORTDESC relDesc FROM ent.vwACTIVERELATIONSHIPS";
					sql += " WHERE ((CHILD_SOURCE_SYSTEM_ID = "+criteria.sourceSystem+" AND PARENT_SOURCE_SYSTEM_ID ="+criteria.targetSystem+") OR (CHILD_SOURCE_SYSTEM_ID = "+criteria.targetSystem+" AND PARENT_SOURCE_SYSTEM_ID ="+criteria.sourceSystem+")) AND ( CHILD_ENTITY_TYPE_ID="+criteria.sourceEntityType+" AND PARENT_ENTITY_TYPE_ID="+criteria.targetEntityType+")";

					dbcmd.CommandText = sql;
					using (IDataReader reader = dbcmd.ExecuteReader()) {
						while(reader.Read()) {

							int srcID    = Int32.Parse(reader["srcID"].ToString());
							int targetID = Int32.Parse(reader["tarID"].ToString());
							int relType = Int32.Parse(reader["relType"].ToString());
							string relTypeDesc = reader["relDesc"].ToString();

							retVal.Add(new EntityRelationship(srcID,targetID,relType,relTypeDesc));
						}
					}
				}
			}
			return retVal;
		}

		[WebMethod]
		public static List<KeyValue> GetSourceSystems()
		{
			List<KeyValue> retVal = new List<KeyValue>();
			using (aConn = new SqlConnection(aConnStr)) {
				aConn.Open();
				using (IDbCommand dbcmd = aConn.CreateCommand()) {
					string sql ="SELECT Source_System_ID ID, Source_System_Desc Value FROM ent.SOURCE_SYSTEM";
					dbcmd.CommandText = sql;
					using (IDataReader reader = dbcmd.ExecuteReader()) {
						
						while(reader.Read()) {
							int anID = Int32.Parse(reader["ID"].ToString());
							string aValue = (string) reader["Value"].ToString();
							retVal.Add(new KeyValue(anID,aValue));
						}
					}
				}
			}
			return retVal;
		}

		[WebMethod]
		public static List<KeyValue> GetRelationshipTypes()
		{
			List<KeyValue> retVal = new List<KeyValue>();
			using (aConn = new SqlConnection(aConnStr)) {
				aConn.Open();
				using (IDbCommand dbcmd = aConn.CreateCommand()) {
					string sql ="SELECT ENTITY_RELATIONSHIP_TYPE_ID ID, ENTITY_RELATIONSHIP_TYPE_SHORTDESC Value FROM ent.ENTITY_RELATIONSHIP_TYPE";
					dbcmd.CommandText = sql;
					using (IDataReader reader = dbcmd.ExecuteReader()) {

						while(reader.Read()) {
							int anID = Int32.Parse(reader["ID"].ToString());
							string aValue = (string) reader["Value"].ToString();
							retVal.Add(new KeyValue(anID,aValue));
						}
					}
				}
			}
			return retVal;
		}

		[WebMethod]
		public static List<KeyValue> GetEntityTypes()
		{
			List<KeyValue> retVal = new List<KeyValue>();
			using (aConn = new SqlConnection(aConnStr)) {
				aConn.Open();
				using (IDbCommand dbcmd = aConn.CreateCommand()) {
					string sql ="SELECT Entity_Type_ID ID, Entity_Type_Desc Value FROM ent.Entity_Type";
					dbcmd.CommandText = sql;
					using (IDataReader reader = dbcmd.ExecuteReader()) {
						while(reader.Read()) {
							int anID = Int32.Parse(reader["ID"].ToString());
							string aValue = (string) reader["Value"].ToString();
							retVal.Add(new KeyValue(anID,aValue));
						}
					}
				}
			}
			return retVal;
		}


		[WebMethod]
		[GenerateScriptType(typeof(SourceEntity))] 
		public static bool UpdateRelationship (UpdateRelationshipRequest updateRelationship)
		{
			bool retVal = true;

			//Check to ensure properties are valid
			if (updateRelationship != null) {
				if (updateRelationship.source != null && updateRelationship.dest != null && updateRelationship.relationshipType!= -1) {
					// Valid UpdateRelationshipRequest
					using (aConn = new SqlConnection(aConnStr)) {
						aConn.Open();
						using (IDbCommand dbcmd = aConn.CreateCommand()) {
							
							dbcmd.CommandType = CommandType.StoredProcedure;
							dbcmd.CommandText = "ent.usp_RELATIONSHIP_CREATE";

							
							SqlParameter param1 = new SqlParameter("@inRelTypeId", updateRelationship.relationshipType);
							SqlParameter param2 = new SqlParameter("@inParentEntId", updateRelationship.source.id);
							SqlParameter param3 = new SqlParameter("@inChildEntId", updateRelationship.dest.id);

							dbcmd.Parameters.Add(param1);
							dbcmd.Parameters.Add(param2);
							dbcmd.Parameters.Add(param3);

							
							/*SqlParameter returnValue = new SqlParameter("ReturnValue", User);
							returnValue.Direction = System.Data.ParameterDirection.ReturnValue;
							dbcmd.Parameters.Add(returnValue);*/

							dbcmd.ExecuteNonQuery();
						}
					}
				}
			} else {
				retVal = false;
			}

			return retVal;
		}
	}

}

