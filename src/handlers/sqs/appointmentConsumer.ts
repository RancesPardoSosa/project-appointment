import { SQSEvent } from "aws-lambda";
import { AppointmentProcessorPERepository } from "../../repository/appointmentProcessorPERepository";
import { AppointmentProcessorService } from "../../services/appointmentProcessorService";
import { AppointmentProcessorCLRepository } from "../../repository/appointmentProcessorCLRepository";
import { AppointmentStatusRepository } from "../../repository/appointmentStatusRepository";
import { AppointmentStatusService } from "../../services/appointmentStatusService";

const repositoryProcessorPE = new AppointmentProcessorPERepository();
const serviceProcessorPE = new AppointmentProcessorService(
  repositoryProcessorPE
);

const repositoryProcessorCL = new AppointmentProcessorCLRepository();
const serviceProcessorCL = new AppointmentProcessorService(
  repositoryProcessorCL
);

const repositoryStatus = new AppointmentStatusRepository();
const serviceStatus = new AppointmentStatusService(repositoryStatus);

export const AppointmentPEConsumer = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const payload = JSON.parse(body.Message);
    await serviceProcessorPE.processAppointment({
      id: payload.id,
      insuredId: payload.insuredId,
      scheduleId: payload.scheduleId,
      countryISO: payload.countryISO,
    });
  }
};

export const AppointmentCLConsumer = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const payload = JSON.parse(body.Message);
    console.log(payload);
    await serviceProcessorCL.processAppointment({
      id: payload.id,
      insuredId: payload.insuredId,
      scheduleId: payload.scheduleId,
      countryISO: payload.countryISO,
    });
  }
};

export const ConfirmAppointmentConsumer = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    console.log(body);
    await serviceStatus.appointmentConfirm(body.detail.id);
  }
};
