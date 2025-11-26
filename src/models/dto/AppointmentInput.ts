import { IsIn, IsInt, Length, Matches, Min } from "class-validator";

export class AppointmentInput {
  @Length(5, 5)
  @Matches(/^\d{5}$/)
  insuredId: string;
  @IsInt()
  @Min(1)
  scheduleId: number;
  @IsIn(["PE", "CL"])
  countryISO: string;
}
