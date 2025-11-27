import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { AppointmentModel } from "../models/AppointmentModel";
import { IAppointmentStatusRepository } from "../models/interfaces/IAppointmentStatusRepository";
import { DBDynamoClient } from "../utility/dynamoClient";

const client = DBDynamoClient();
export class AppointmentStatusRepository
  implements IAppointmentStatusRepository
{
  async updateStatusCompleted(id: string): Promise<AppointmentModel> {
    const result = await client.send(
      new UpdateCommand({
        TableName: process.env.DYNAMODB_TABLE!,
        Key: { id },
        UpdateExpression: "SET #status = :s, updatedAt = :u",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":s": "Completed",
          ":u": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return result.Attributes as AppointmentModel;
  }
}
