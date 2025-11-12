import { v4 } from "uuid";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const TABLE_NAME = process.env.DYNAMODB_TABLE!;
const TOPIC_ARN = process.env.APPOINTMENTS_TOPIC_ARN!;

export const createAppointment = async (event: any) => {
  const { insuredId, scheduleId, countryISO } = JSON.parse(event.body);
  const id = v4();

  const newAppointment = {
    id,
    insuredId,
    scheduleId,
    countryISO,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  await dynamoDb
    .put({
      TableName: TABLE_NAME,
      Item: newAppointment,
    })
    .promise();

  await sns
    .publish({
      TopicArn: TOPIC_ARN,
      Message: JSON.stringify(newAppointment),
      MessageAttributes: {
        countryISO: {
          DataType: "String",
          StringValue: countryISO,
        },
      },
    }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(newAppointment),
  };
};

export const confirmAppointment = async (event: any) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const detail = body.detail
    const { id } = detail;

    await dynamoDb
      .update({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: "set #s = :s, updatedAt = :u",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: {
          ":s": "completed",
          ":u": new Date().toISOString(),
        },
      })
      .promise();
  }

  return { statusCode: 200, body: "Confirmaciones procesadas" };
};

export const listAppointmentsByInsured = async (event: any) => {
  const insuredId = event.queryStringParameters?.insuredId;

  if (!insuredId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Debe proporcionar insuredId" }),
    };
  }

  try {
    const result = await dynamoDb
      .query({
        TableName: TABLE_NAME,
        IndexName: "InsuredIndex",
        KeyConditionExpression: "insuredId = :id",
        ExpressionAttributeValues: {
          ":id": insuredId,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error al obtener citas" }),
    };
  }
};
