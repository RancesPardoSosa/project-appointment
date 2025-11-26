import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { AppointmentService } from "../services/appointmentService";

const service = new AppointmentService();
export const ScheduleAppointment = middy((event: APIGatewayProxyEventV2) => {
  return service.CreateAppointment(event);
}).use(bodyParser());
