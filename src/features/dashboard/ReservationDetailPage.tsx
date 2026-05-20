import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationService } from '../../api/services/reservationService';
import { formatDate } from '../../utils/dateUtils';
import { useAuthStore } from '../auth/authStore';


export default function ReservationDetailPage(){
    const {id} = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {role} = useAuthStore();
    

    const [cancelReason, setCancelReason] = useState("");
    
    const {data : reservation, isLoading} = useQuery({
        queryKey : ['reservation', id],
        queryFn : () => reservationService.getReservationById(id!),
        enabled : !!id,
    });

    const {mutate : cancelReservation, isPending : isCanceling} = 
    useMutation({
        mutationFn : (reason : string) => reservationService.cancelReservation(id!, {cancelReason : reason}),
        onSuccess : () => {
            alert("Rezervasyonunuz iptal edildi.");
            queryClient.invalidateQueries({queryKey : ['reservations',id]});
        },
        onError : (error : any)=> {
            alert(error.response?.data?.message || "Rezervasyon iptal edilirken bir hata meydana geldi.");
        }
    });

    if(isLoading) return <div className="p-8 text-center">Rezervasyon Yükleniyor...</div>;

    if(!reservation) return <div className="p-8 text-center text-red-500">Rezervasyon Bulunamadı.</div>;

    const {date, time } = formatDate(reservation.scheduledAt);

   return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm mt-8">
            <button onClick={() => navigate(-1)} className="text-[#8A96A3] hover:text-[#0B1628] mb-4 font-bold">
                &larr; Geri Dön
            </button>
            
            <h1 className="text-2xl font-bold text-[#0B1628] mb-6">Rezervasyon Bilgileri</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-md">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Ders Paketi</p>
                    <p className="text-lg font-medium">{reservation.packageName}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Rezervasyon Durumu</p>
                    <p className="text-lg font-medium">{reservation.status}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Tarih & Saat</p>
                    <p className="text-lg font-medium">{date} - {time}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                        {role === 'Coach' ? `Student` : `Antrenör`}
                    </p>
                    <p className="text-lg font-medium">
                        {role === 'Coach' ? `Student: ${reservation.studentName}` : `Coach: ${reservation.coachName}`}
                    </p>
                </div>
            </div>
            {/* Cancel Section - Only show if it's Pending or Confirmed */}
            {(reservation.status === 'Pending' || reservation.status === 'Confirmed') && (
                <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Rezervasyon İptali</h3>
                    <textarea 
                        className="w-full border rounded-md p-3 mb-3 focus:outline-none focus:border-red-500"
                        placeholder="Lütfen iptal nedeninizi belirtiniz."
                        rows={3}
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <button 
                        onClick={() => cancelReservation(cancelReason)}
                        disabled={!cancelReason || isCanceling}
                        className="bg-red-500 text-white px-6 py-2 rounded-md font-bold hover:bg-red-600 disabled:opacity-50"
                    >
                        {isCanceling ? 'İptal Ediliyor...' : 'İptali Onayla'}
                    </button>
                </div>
            )}
        </div>
    );



}
