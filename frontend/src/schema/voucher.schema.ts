import { z } from 'zod';

export const voucherSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  id: z.string().min(1, "Crew ID is required"),
  flightNumber: z.string().min(1, "Flight number required"),
  date: z.string().min(1, "Date is required"),
  aircraft: z.string().min(1, "Aircraft is required"),
});

export type VoucherFormData = z.infer<typeof voucherSchema>;
