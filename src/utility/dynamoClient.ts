import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const DBDynamoClient = () => {
  const client = new DynamoDBClient({})
  const ddbDocClient = DynamoDBDocumentClient.from(client)
  return ddbDocClient;
};
