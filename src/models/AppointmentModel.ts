export interface AppointmentModel {
  id?: string;
  insuredId: string;
  scheduleId: number;
  countryISO: "PE" | "CL";
  createdAt?: Date;
  updatedAt?: Date;
}
