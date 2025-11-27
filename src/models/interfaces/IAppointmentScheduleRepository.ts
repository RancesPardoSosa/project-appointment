import { AppointmentModel } from "../AppointmentModel";

export interface IAppointmentScheduleRepository {
  listAppointmentsByInsuredId(insuredId: string): Promise<AppointmentModel[]>;
  createAppointment(appointment: AppointmentModel): Promise<AppointmentModel>;
}
