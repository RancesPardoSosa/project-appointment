import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { AppointmentModel } from "../models/AppointmentModel";
import { IAppointmentProcessorRepository } from "../models/interfaces/IAppointmentProcessorRepository";

export class AppointmentProcessorService {
  constructor(private repository: IAppointmentProcessorRepository) {}
  async processAppointment({
    id,
    insuredId,
    scheduleId,
    countryISO,
  }: AppointmentModel) {
    const data = await this.repository.createAppointment({
      id,
      insuredId,
      scheduleId,
      countryISO,
    });
    console.log("Cita guardada :" + data);

    const client = new EventBridgeClient({});
    const response = await client.send(
      new PutEventsCommand({
        Entries: [
          {
            Source: "appointments.service",
            DetailType: "AppointmentConfirmation",
            EventBusName: process.env.EVENT_BUS_NAME,
            Detail: JSON.stringify({
              id: data.id,
            }),
          },
        ],
      })
    );
    console.log("EventBridge : " + response);
  }
}
