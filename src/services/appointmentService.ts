import { APIGatewayProxyEventV2 } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { AppointmentInput } from "../models/dto/AppointmentInput";
import { AppValidationError } from "../utility/error";
import { ErrorResponse, SucessResponse } from "../utility/response";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { IAppointmentScheduleRepository } from "../models/interfaces/IAppointmentScheduleRepository";

export class AppointmentService {
  constructor(private repository: IAppointmentScheduleRepository) {}
  async createAppointment(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(AppointmentInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);
      const data = await this.repository.createAppointment({
        insuredId: input.insuredId,
        scheduleId: input.scheduleId,
        countryISO: input.countryISO,
      });
      const params = {
        TopicArn: process.env.APPOINTMENTS_TOPIC_ARN,
        Message: JSON.stringify(data),
        MessageAttributes: {
          countryISO: {
            DataType: "String",
            StringValue: data.countryISO,
          },
        },
      };
      const sns = new SNSClient({});
      await sns.send(new PublishCommand(params));
      return SucessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async listAppointmentsByInsuredId(event: APIGatewayProxyEventV2){
    const insuredId = event.queryStringParameters?.insuredId;
    if (!insuredId) {
      return ErrorResponse(404, {message: "Debe proporcionar insuredId"} )
    }

    const listAppointments = await this.repository.listAppointmentsByInsuredId(insuredId)

    return SucessResponse(listAppointments)
  }
}
