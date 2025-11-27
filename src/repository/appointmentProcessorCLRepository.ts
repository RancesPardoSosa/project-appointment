import { AppointmentModel } from "../models/AppointmentModel";
import { IAppointmentProcessorRepository } from "../models/interfaces/IAppointmentProcessorRepository";
import { getDbCL } from "../utility/database";

export class AppointmentProcessorCLRepository
  implements IAppointmentProcessorRepository
{
  async createAppointment({
    id,
    insuredId,
    scheduleId,
    countryISO,
  }: AppointmentModel) {
    const db = getDbCL();
    const query =
      "INSERT INTO appointments_cl (id, insuredId, scheduleId, countryISO) VALUES (?, ?, ?, ?)";
    const params = [id, insuredId, scheduleId, countryISO];
    await db.execute(query, params);
    return { id, insuredId, scheduleId, countryISO };
  }
}
