import { AppointmentModel } from "../models/AppointmentModel";

export class AppointmentRepository {
  async createAppointment({
    insuredId,
    scheduleId,
    countryISO,
  }: AppointmentModel) {}
}
