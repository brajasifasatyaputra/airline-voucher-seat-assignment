import { create } from 'zustand';
import axios from 'axios';
import type { VoucherFormData } from '../schema/voucher.schema';

interface VoucherState {
  seats: string[] | null;
  error: string | null;
  isLoading: boolean;
  aircrafts: { type: string }[],
  fetchAircrafts: () => Promise<void>;
  generate: (data: VoucherFormData) => Promise<void>;
  resetStore: () => void;
}

export const useVoucherStore = create<VoucherState>((set) => ({
  aircrafts: [],
  seats: null,
  error: null,
  isLoading: false,

  fetchAircrafts: async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/aircrafts');
      set({ aircrafts: res.data.aircrafts });
    } catch (err) {
      console.error("Failed to Fetch Aircrafts Data", err);
    }
  },

  generate: async (data) => {
    set({ isLoading: true, error: null, seats: null });

    try {
      const checkRes = await axios.post('http://localhost:3000/api/check', {
        flightNumber: data.flightNumber,
        date: data.date,
      });

      if (checkRes.data.exists) {
        throw new Error(`Vouchers have already been generated for flight number ${data.flightNumber} on ${data.date}.`);
      }

      const genRes = await axios.post('http://localhost:3000/api/generate', data);
      set({ seats: genRes.data.seats, isLoading: false });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to generate voucher";
      set({ error: errorMessage, isLoading: false });
    }
  },

  resetStore: () => set({ seats: null, error: null }),
}));
