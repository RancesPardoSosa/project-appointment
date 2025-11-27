import { AppointmentModel } from "../AppointmentModel";

export interface IAppointmentStatusRepository {
  updateStatusCompleted(id: string): Promise<AppointmentModel>;
}
