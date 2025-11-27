export interface AppointmentModel {
  id?: string;
  insuredId: string;
  scheduleId: number;
  countryISO: string;
  state?: string;
}
