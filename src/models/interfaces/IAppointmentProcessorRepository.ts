import { AppointmentModel } from "../AppointmentModel";

export interface IAppointmentProcessorRepository {
  createAppointment(appointment: AppointmentModel): Promise<AppointmentModel>;
}
