import { AppointmentModel } from "../models/AppointmentModel";
import { DBDynamoClient } from "../utility/dynamoClient";
import { v4 } from "uuid";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { IAppointmentScheduleRepository } from "../models/interfaces/IAppointmentScheduleRepository";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = DBDynamoClient();
export class AppointmentScheduleRepository
  implements IAppointmentScheduleRepository
{
  async listAppointmentsByInsuredId(
    insuredId: string
  ): Promise<AppointmentModel[]> {
    const command = new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE,
      IndexName: "InsuredIndex",
      KeyConditionExpression: "insuredId = :id",
      ExpressionAttributeValues: {
        ":id": { S: insuredId },
      },
    });
    const result = await client.send(command);

    const appointments: AppointmentModel[] = (result.Items || []).map(
      (item) => {
        const { id, insuredId, scheduleId, countryISO, status } =
          unmarshall(item);
        return { id, insuredId, scheduleId, countryISO, status };
      }
    );

    return appointments;
  }

  async createAppointment({
    insuredId,
    scheduleId,
    countryISO,
  }: AppointmentModel) {
    const id = v4();

    const newAppointment = {
      id,
      insuredId,
      scheduleId,
      countryISO,
      status: "pending",
    };

    await client.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Item: newAppointment,
      })
    );
    return newAppointment;
  }
}
