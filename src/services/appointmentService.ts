import { APIGatewayProxyEventV2 } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { AppointmentInput } from "../models/dto/AppointmentInput";
import { AppValidationError } from "../utility/error";
import { ErrorResponse } from "../utility/response";

export class AppointmentService {
  async CreateAppointment(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(AppointmentInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }
}
