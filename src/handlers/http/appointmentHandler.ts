import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { AppointmentService } from "../../services/appointmentService";
import { AppointmentScheduleRepository } from "../../repository/appointmentScheduleRepository";

const repository = new AppointmentScheduleRepository();
const service = new AppointmentService(repository);

export const ScheduleAppointment = middy((event: APIGatewayProxyEventV2) => {
  return service.createAppointment(event);
}).use(bodyParser());

export const ListAppointmentsByInsuredId = async (
  event: APIGatewayProxyEventV2
) => {
  return service.listAppointmentsByInsuredId(event);
};
