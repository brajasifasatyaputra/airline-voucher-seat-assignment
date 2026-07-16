import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { voucherSchema, type VoucherFormData } from '../schema/voucher.schema';
import { useVoucherStore } from '../store/useVoucherStore';

import bgImage from '../assets/bg-glassmorphism.jpeg';

export default function VoucherForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      name: '',
      id: '',
      flightNumber: '',
      date: '',
      aircraft: ''
    }
  });

  const { generate, aircrafts, fetchAircrafts, isLoading, error, seats, resetStore } = useVoucherStore();

  useEffect(() => { 
    fetchAircrafts(); 
  }, [fetchAircrafts]);

  const handleReset = () => {
    reset();
    resetStore();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center p-4 relative font-sans"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <form 
        onSubmit={handleSubmit(generate)} 
        className="w-full max-w-3xl bg-white/20 backdrop-blur-md border border-white/40 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] flex flex-col relative z-10 overflow-hidden"
      >
        
        <div className="p-10 md:p-14">
          <h2 className="text-center text-2xl text-shadow-lg shadow-indigo-500/50 text-[#f0f8ff] font-bold mb-10 tracking-wide drop-shadow-sm">
            Voucher Assignment
          </h2>

          {seats ? (
            <div className="py-8 text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100/80 backdrop-blur-sm border border-green-200/50 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
              <p className="text-white mb-8 font-medium">Vouchers have been successfully generated.</p>
              <div className="text-4xl md:text-5xl font-black text-[#19538a] tracking-widest bg-white/40 backdrop-blur-sm py-8 rounded-lg border border-white/50 shadow-inner">
                {seats.join(' - ')}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {error && (
                <div className="p-4 bg-red-70/80 backdrop-blur-sm border border-red-200/50 text-red-600 text-md rounded-lg font-medium">
                  {error}
                </div>
              )}

              {/* Crew Name & ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input 
                    autoFocus
                    disabled={isLoading}
                    {...register("name")} 
                    placeholder="Crew Name" 
                    className={`w-full border border-white/50 bg-white/50 p-3.5 text-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:bg-white/70 focus:border-[#296eb4] focus:ring-1 focus:ring-[#296eb4] transition-all rounded-lg shadow-sm ${errors.name ? 'border-red-400' : ''}`} 
                  />
                  {errors.name && (
                    <p className="text-[#df241b] font-semibold">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <input 
                    disabled={isLoading}
                    {...register("id")} 
                    placeholder="Crew ID" 
                    className={`w-full border border-white/50 bg-white/50 p-3.5 text-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:bg-white/70 focus:border-[#296eb4] focus:ring-1 focus:ring-[#296eb4] transition-all rounded-lg shadow-sm ${errors.id ? 'border-red-400' : ''}`} 
                  />
                  {errors.id && <p className="text-[#df241b] font-semibold">{errors.id.message}</p>}
                </div>
              </div>

              {/* Flight Number & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input 
                    disabled={isLoading}
                    {...register("flightNumber")} 
                    placeholder="Flight Number (e.g. GA-102)" 
                    className={`w-full border border-white/50 bg-white/50 p-3.5 text-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:bg-white/70 focus:border-[#296eb4] focus:ring-1 focus:ring-[#296eb4] transition-all uppercase rounded-lg shadow-sm ${errors.flightNumber ? 'border-red-400' : ''}`} 
                  />
                  {errors.flightNumber && <p className="text-[#df241b] font-semibold">{errors.flightNumber.message}</p>}
                </div>

                <div>
                  <input 
                    type="date" 
                    disabled={isLoading}
                    {...register("date")} 
                    className={`w-full border border-white/50 bg-white/50 p-3.5 text-sm text-gray-900 focus:outline-none focus:bg-white/70 focus:border-[#296eb4] focus:ring-1 focus:ring-[#296eb4] transition-all rounded-lg shadow-sm ${errors.date ? 'border-red-400' : ''}`} 
                  />
                  {errors.date && <p className="text-[#df241b] font-semibold">{errors.date.message}</p>}
                </div>
              </div>

              {/* Aircraft Type & Empty Space */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <select 
                    disabled={isLoading}
                    {...register("aircraft")} 
                    className={`w-full border border-white/50 bg-white/50 p-3.5 text-sm text-gray-900 focus:outline-none focus:bg-white/70 focus:border-[#296eb4] focus:ring-1 focus:ring-[#296eb4] transition-all rounded-lg shadow-sm cursor-pointer ${errors.aircraft ? 'border-red-400' : ''}`}
                  >
                    <option value="" disabled hidden>Select Aircraft Type</option>
                    {aircrafts.map((a) => (
                      <option key={a.type} value={a.type} className="bg-white text-gray-900">{a.type}</option>
                    ))}
                  </select>
                  {errors.aircraft && <p className="text-[#df241b] font-semibold">{errors.aircraft.message}</p>}
                </div>
                <div className="hidden md:block"></div>
              </div>

            </div>
          )}
        </div>

        <div className="w-full bg-[#357ebd]/80 backdrop-blur-md border-t border-white/30 flex">
          {!seats ? (
            <button 
              type="submit"
              disabled={isLoading} 
              className="w-full text-white py-5 px-10 flex justify-end items-center text-sm font-medium tracking-widest hover:bg-[#286090]/90 transition-colors disabled:bg-[#5b95c9]/80 disabled:cursor-wait"
            >
              {isLoading ? 'PROCESSING...' : (
                <>
                  GENERATE VOUCHER <span className="ml-3 text-lg">→</span>
                </>
              )}
            </button>
          ) : (
            <div 
              onClick={handleReset}
              className="w-full text-white py-5 px-10 flex justify-start items-center text-sm font-medium tracking-widest hover:bg-[#286090]/90 transition-colors"
            >
              <span className="mr-3 text-lg">←</span> ASSIGN ANOTHER FLIGHT
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
