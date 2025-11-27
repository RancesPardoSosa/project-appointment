import { IAppointmentStatusRepository } from "../models/interfaces/IAppointmentStatusRepository";

export class AppointmentStatusService {
  constructor(private repository: IAppointmentStatusRepository) {}

  async appointmentConfirm(id: string) {
    const data = await this.repository.updateStatusCompleted(id);
    console.log("Estado actualizado " + data);
  }
}
