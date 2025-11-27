import { AppointmentModel } from "../models/AppointmentModel";
import { IAppointmentProcessorRepository } from "../models/interfaces/IAppointmentProcessorRepository";
import { getDbPE } from "../utility/database";

export class AppointmentProcessorPERepository
  implements IAppointmentProcessorRepository
{
  async createAppointment({
    id,
    insuredId,
    scheduleId,
    countryISO,
  }: AppointmentModel) {
    const db = getDbPE();
    const query =
      "INSERT INTO appointments_pe (id, insuredId, scheduleId, countryISO) VALUES (?, ?, ?, ?)";
    const params = [id, insuredId, scheduleId, countryISO];
    await db.execute(query, params);
    return { id, insuredId, scheduleId, countryISO };
  }
}
