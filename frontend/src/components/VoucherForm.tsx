import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { voucherSchema, type VoucherFormData } from '../schema/voucher.schema';
import { useVoucherStore } from '../store/useVoucherStore';

export default function VoucherForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema)
  });
  const { generate, aircrafts, fetchAircrafts, isLoading, error, seats } = useVoucherStore();

  useEffect(() => { fetchAircrafts(); }, [fetchAircrafts]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6">Generate Voucher</h1>
      <form onSubmit={handleSubmit(generate)} className="space-y-4">
        <input {...register("name")} placeholder="Crew Name" className="w-full border p-2 rounded" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        
        <input {...register("id")} placeholder="Crew ID" className="w-full border p-2 rounded" />
        {errors.id && <p className="text-red-500 text-sm">{errors.id.message}</p>}
        
        <input {...register("flightNumber")} placeholder="Flight Number (e.g. GA102)" className="w-full border p-2 rounded" />
        <input type="date" {...register("date")} className="w-full border p-2 rounded" />
        
        <select {...register("aircraft")} className="w-full border p-2 rounded">
          <option value="">Select Aircraft</option>
          {aircrafts.map((a) => (
            <option key={a.type} value={a.type}>{a.type}</option>
          ))}
        </select>

        <button disabled={isLoading} className="w-full bg-blue-600 text-white p-2 rounded">
          {isLoading ? 'Generating...' : 'Generate Vouchers'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {seats && <div className="mt-4 p-4 bg-green-50 rounded text-green-700 font-bold">Seats: {seats.join(', ')}</div>}
    </div>
  );
}