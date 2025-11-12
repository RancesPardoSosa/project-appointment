import AWS from 'aws-sdk';
import mysql from 'mysql2/promise';

const eventBridge = new AWS.EventBridge();

const RDS_HOST = process.env.RDS_HOST_PE!;
const RDS_USER = process.env.RDS_USER_PE!;
const RDS_PASS = process.env.RDS_PASS_PE!;
const RDS_DB = process.env.RDS_DB_PE!;
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME!;

export const handler = async (event: any) => {
  const connection = await mysql.createConnection({
    host: RDS_HOST,
    user: RDS_USER,
    password: RDS_PASS,
    database: RDS_DB,
  });

  try {
    for (const record of event.Records) {
      const body = JSON.parse(record.body);
      const appointment = JSON.parse(body.Message);
      console.log('Procesando cita de Peru:', appointment.id);

      await connection.execute(
        'INSERT INTO appointments_pe (id, insuredId, scheduleId, countryISO, status) VALUES (?, ?, ?, ?, ?)',
        [appointment.id, appointment.insuredId, appointment.scheduleId, appointment.countryISO, 'completed']
      );

      await eventBridge
        .putEvents({
          Entries: [
            {
              Source: 'appointments.service',
              DetailType: 'AppointmentConfirmation',
              EventBusName: EVENT_BUS_NAME,
              Detail: JSON.stringify({
                id: appointment.id,
                countryISO: appointment.countryISO,
                status: 'completed',
              }),
            },
          ],
        })
        .promise();
    }
  } catch (error) {
    console.error('Error en processPE:', error);
  } finally {
    await connection.end();
  }
};
