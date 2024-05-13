export function statusLogBackgroudColor(status: string) {
  switch (status) {
    case "success":
      return "bg-green-600";
    case "error":
      return "bg-red-600";
    default:
      return "bg-slate-600";
  }
}

export function selectPageUnderline(page: string, pageSelect: string) {
  if (page === pageSelect) return "underline underline-offset-8";
  return "";
}

export type typeOptions = "INTERVALO" | "DIÁRIO" | "SEMANAL" | "PERSONALIZADO";

export const cronOptions = [
  { label: "TODO MINUTO", cron_time: "* * * * *" },
  { label: "A CADA 2 MINUTOS", cron_time: "*/2 * * * *" },
  { label: "A CADA 5 MINUTOS", cron_time: "*/5 * * * *" },
  { label: "A CADA 10 MINUTOS", cron_time: "*/10 * * * *" },
  { label: "A CADA 20 MINUTOS", cron_time: "*/20 * * * *" },
  { label: "A CADA 15 MINUTOS", cron_time: "*/15 * * * *" },
  { label: "A CADA MEIA HORA", cron_time: "0,30 * * * *" },
  { label: "A CADA HORA", cron_time: "0 * * * *" },
  { label: "A CADA 2 HORAS", cron_time: "0 */2 * * *" },
  { label: "A CADA 4 HORAS", cron_time: "0 */4 * * *" },
  { label: "A CADA 6 HORAS", cron_time: "0 */6 * * *" },
  { label: "A CADA 8 HORAS", cron_time: "0 */8 * * *" },
  { label: "A CADA 12 HORAS", cron_time: "0 */12 * * *" },
];

export const horasOptions = [
  { label: "01:00 AM", cron_time: "0 1 * * *" },
  { label: "02:00 AM", cron_time: "0 2 * * *" },
  { label: "03:00 AM", cron_time: "0 3 * * *" },
  { label: "04:00 AM", cron_time: "0 4 * * *" },
  { label: "06:00 AM", cron_time: "0 6 * * *" },
  { label: "07:00 AM", cron_time: "0 7 * * *" },
  { label: "08:00 AM", cron_time: "0 8 * * *" },
  { label: "09:00 AM", cron_time: "0 9 * * *" },
  { label: "10:00 AM", cron_time: "0 10 * * *" },
  { label: "11:00 AM", cron_time: "0 11 * * *" },
  { label: "12:00 PM", cron_time: "0 12 * * *" },
  { label: "13:00 PM", cron_time: "0 13 * * *" },
  { label: "14:00 PM", cron_time: "0 14 * * *" },
  { label: "15:00 PM", cron_time: "0 15 * * *" },
  { label: "16:00 PM", cron_time: "0 16 * * *" },
  { label: "17:00 PM", cron_time: "0 17 * * *" },
  { label: "18:00 PM", cron_time: "0 18 * * *" },
  { label: "19:00 PM", cron_time: "0 19 * * *" },
  { label: "20:00 PM", cron_time: "0 20 * * *" },
  { label: "21:00 PM", cron_time: "0 21 * * *" },
  { label: "22:00 PM", cron_time: "0 22 * * *" },
  { label: "23:00 PM", cron_time: "0 23 * * *" },
  { label: "MEIA NOITE", cron_time: "0 0 * * *" },
];

export const diasOptions = [
  { label: "SEG ", cron_time: " * * * mon" },
  { label: "TER ", cron_time: " * * * tue" },
  { label: "QUA ", cron_time: " * * * wed" },
  { label: "QUI ", cron_time: " * * * thu" },
  { label: "SEX ", cron_time: " * * * fri" },
  { label: "SAB ", cron_time: " * * * sat" },
  { label: "DOM ", cron_time: " * * * sun" },
];

export const horaOptions = [
  { label: "01:00 AM", cron_time: "0 1" },
  { label: "02:00 AM", cron_time: "0 2" },
  { label: "03:00 AM", cron_time: "0 3" },
  { label: "04:00 AM", cron_time: "0 4" },
  { label: "06:00 AM", cron_time: "0 6" },
  { label: "07:00 AM", cron_time: "0 7" },
  { label: "08:00 AM", cron_time: "0 8" },
  { label: "09:00 AM", cron_time: "0 9" },
  { label: "10:00 AM", cron_time: "0 10" },
  { label: "11:00 AM", cron_time: "0 11" },
  { label: "12:00 PM", cron_time: "0 12" },
  { label: "13:00 PM", cron_time: "0 13" },
  { label: "14:00 PM", cron_time: "0 14" },
  { label: "15:00 PM", cron_time: "0 15" },
  { label: "16:00 PM", cron_time: "0 16" },
  { label: "17:00 PM", cron_time: "0 17" },
  { label: "18:00 PM", cron_time: "0 18" },
  { label: "19:00 PM", cron_time: "0 19" },
  { label: "20:00 PM", cron_time: "0 20" },
  { label: "21:00 PM", cron_time: "0 21" },
  { label: "22:00 PM", cron_time: "0 22" },
  { label: "23:00 PM", cron_time: "0 23" },
  { label: "MEIA NOITE", cron_time: "0 0" },
];

export const cronOptionsSemanal = (dia: number, hora: number) => {
  const cron_time = `0 ${hora} ${dia} * *`;
  return cron_time;
};
