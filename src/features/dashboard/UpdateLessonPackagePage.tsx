import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lessonPackageService } from '../../api/services/lessonPackageService';
import { imageService } from '../../api/services/imageService';
import { useAuthStore } from '../auth/authStore';

const updatePackageSchema = z.object({
    packageName: z.string().min(1, 'Paket adı gereklidir.'),
    packageDescription: z.string().max(500, 'Paket açıklaması en fazla 500 karakter olabilir.'),
    durationInMinutes: z.number().min(15, 'Ders süresi en az 15 dakika olmalıdır.'),
    packagePrice: z.number().min(1, 'Fiyat pozitif bir sayı olmalıdır'),
    requirements: z.string().optional(),
    locationType: z.number().min(1, "Lütfen bir konum türü seçiniz."),
    lessonModel: z.number().min(1, "Lütfen bir ders modeli seçiniz."),
    coverImageUrl: z.string().optional(),
    isActive: z.boolean(), // Removed .default(true) to fix type mismatch with react-hook-form
});

type UpdatePackageFormValues = z.infer<typeof updatePackageSchema>;


const UpdateLessonPackagePage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentUserId = useAuthStore(state => state.userId);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const {data : existingPackage, isLoading: isFetching} = useQuery({
        queryKey : ['package',id],
        queryFn : () => lessonPackageService.getPackageById(id!),
        enabled : !!id
    });


     const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        reset, // Used to fill the form when data arrives
        formState: { errors, isDirty }
    } = useForm<UpdatePackageFormValues>({
        resolver: zodResolver(updatePackageSchema),
        defaultValues: {
            packageName: '',
            packageDescription: '',
            durationInMinutes: 60,
            packagePrice: 0,
            requirements: '',
            locationType: 0,
            lessonModel: 0,
            coverImageUrl: '',
            isActive: true,
        }
    });


    useEffect(() => {
        if(existingPackage){
            let locationTypeNumber = 0;
            if (existingPackage.locationType === 'CoachLocation') locationTypeNumber = 1;
            else if (existingPackage.locationType === 'StudentLocation') locationTypeNumber = 2;
            else if (existingPackage.locationType === 'Online') locationTypeNumber = 3;


            let lessonModelNumber = 0;
            if(existingPackage.lessonModel === 'OneOnOne') lessonModelNumber = 1;
            else if (existingPackage.lessonModel === 'Group') lessonModelNumber = 2;

            reset({
                packageName : existingPackage.packageName,
                packageDescription : existingPackage.packageDescription,
                durationInMinutes : existingPackage.durationInMinutes,
                packagePrice : existingPackage.packagePrice,
                requirements : existingPackage.requirements ? existingPackage.requirements.join(', ') : '',
                locationType : locationTypeNumber,
                lessonModel : lessonModelNumber,
                coverImageUrl : existingPackage.coverImageUrl,
                isActive : existingPackage.isActive,
            });
            
        }
    }, [existingPackage,reset])
    


    const {mutate : updatePackage,isPending : isUpdating } = useMutation({
         mutationFn: (data: any) => lessonPackageService.updatePackage(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coach-packages', currentUserId] });
            alert('Ders Paketi Başarıyla Güncellendi!');
            navigate('../../coaches/dashboard'); // Go back to dashboard
        },
        onError: (error : any) => {
            console.log("Ders Paketi Güncellenirken bir hata meydana geldi.");
            setError('root' ,{
                message : error.response?.data?.message || 'Paket güncellenirken bir hata meydana geldi.',
            });
        }
    });

    const onSubmit = (data: UpdatePackageFormValues) => {
        const requirementsArray = data.requirements
        ? data.requirements.split(',').map(item => item.trim()).filter(item => item.length > 0) : [];

        const payload = {
            packageName: data.packageName,
            packageDescription: data.packageDescription,
            durationInMinutes: data.durationInMinutes,
            packagePrice: data.packagePrice,
            requirements: requirementsArray,
            locationType: data.locationType,
            lessonModel: data.lessonModel,
            coverImageUrl: data.coverImageUrl || undefined,
            isActive: data.isActive,
        }
        updatePackage(payload);
    };

    if(isFetching){
        return <div className="text-center py-20 text-gray-500 font-bold">Paket bilgileri yükleniyor...</div>;
    }
     return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <Link to="/coaches/dashboard" className="text-[#8A96A3] font-semibold hover:text-[#0B1628] mb-6 flex items-center transition">
                &larr; Arayüze Dön
            </Link>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#0B1628]">Ders Paketini Güncelle</h1>
                    <p className="text-[#8A96A3] mt-2">Mevcut ders paketinizin detaylarını aşağıdan değiştirebilirsiniz.</p>
                </div>
                
                {/* Is Active Toggle */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-sm font-bold text-[#0B1628]">Paket Durumu:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" {...register('isActive')} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#093A32]"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                            {watch('isActive') ? 'Aktif (Listelenir)' : 'Pasif (Gizli)'}
                        </span>
                    </label>
                </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Package Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[#0B1628] uppercase tracking-wide mb-2">Paket Adı</label>
                            <input
                                type="text"
                                {...register('packageName')}
                                placeholder="e.g. Tennis Fundamentals for Beginners"
                                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093A32] ${errors.packageName ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.packageName && <span className="text-red-500 text-sm mt-1">{errors.packageName.message}</span>}
                        </div>
                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-[#0B1628] uppercase tracking-wide mb-2">Fiyat (₺)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('packagePrice', { valueAsNumber: true })}
                                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093A32] ${errors.packagePrice ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.packagePrice && <span className="text-red-500 text-sm mt-1">{errors.packagePrice.message}</span>}
                        </div>
                        {/* Duration In Minutes */}
                        <div>
                            <label className="block text-sm font-medium text-[#0B1628] uppercase tracking-wide mb-2">Ders Süresi (Dakika)</label>
                            <input
                                type="number"
                                {...register('durationInMinutes', { valueAsNumber: true })}
                                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093A32] ${errors.durationInMinutes ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.durationInMinutes && <span className="text-red-500 text-sm mt-1">{errors.durationInMinutes.message}</span>}
                        </div>
                        {/* Lesson Model */}
                        <div>
                            <label className="block text-sm font-medium text-[#0B1628] uppercase tracking-wide mb-2">Ders Formatı</label>
                            <select
                                {...register('lessonModel', { valueAsNumber: true })}
                                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093A32] bg-white ${errors.lessonModel ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value={0} disabled>-- Ders Formatını Seçiniz --</option>
                                <option value={1}>Bire Bir</option>
                                <option value={2}>Grup</option>
                            </select>
                            {errors.lessonModel && <span className="text-red-500 text-sm mt-1">{errors.lessonModel.message}</span>}
                        </div>
                        {/* Location Type */}
                        <div>
                            <label className="block text-sm font-medium text-[#0B1628] uppercase tracking-wide mb-2">Konum Tipi</label>
                            <select
                                {...register('locationType', { valueAsNumber: true })}
                                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093A32] bg-white ${errors.locationType ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value={0} disabled>-- Konumunuzu Seçiniz --</option>
                                <option value={1}>Antrenörün Konumu</option>
                                <option value={2}>Öğrencinin Konumu</option>
                                <option value={3}>Online</option>
                            </select>
                            {errors.locationType && <span className="text-red-500 text-sm mt-1">{errors.locationType.message}</span>}
                        </div>
                        {/* Requirements */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[#0B1628] uppercase tracking-wide mb-2">Gereksinimler</label>
                            <input
                                type="text"
                                {...register('requirements')}
                                placeholder="Örneğin : Su, Havlu, ilgili spora özel ekipmanlar..."
                                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093A32] ${errors.requirements ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            <p className="text-xs text-gray-500 mt-1">Birden fazla gereksinimi virgülle ayırınız.</p>
                        </div>
                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[#0B1628] uppercase tracking-wide mb-2">Paket Açıklaması</label>
                            <textarea
                                {...register('packageDescription')}
                                rows={5}
                                placeholder="Öğrenci neler öğrenecek? Paket içeriği nedir?"
                                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#093A32] resize-none ${errors.packageDescription ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.packageDescription && <span className="text-red-500 text-sm mt-1">{errors.packageDescription.message}</span>}
                        </div>
                        {/* Optional Cover Image */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[#0B1628] uppercase tracking-wide mb-2">Fotoğraf</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#C9A84C] transition-colors relative group overflow-hidden bg-gray-50">
                                {isUploadingImage ? (
                                    <div className="flex flex-col items-center justify-center py-6">
                                        <div className="w-8 h-8 border-4 border-[#093A32] border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-sm text-gray-500 mt-4 animate-pulse">Fotoğraf yükleniyor...</p>
                                    </div>
                                ) : watch('coverImageUrl') ? (
                                    <div className="relative w-full flex flex-col items-center">
                                        <img
                                            src={watch('coverImageUrl')}
                                            alt="Cover Preview"
                                            className="h-48 w-full object-cover rounded-md shadow-sm border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setValue('coverImageUrl', '', { shouldDirty: true })}
                                            className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm font-bold hover:bg-red-100 transition"
                                        >
                                            Fotoğrafı Kaldır
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1 text-center py-4">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#C9A84C] transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 justify-center mt-2">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#093A32] hover:text-[#C9A84C] focus-within:outline-none px-3 py-1 shadow-sm border border-gray-200">
                                                <span>Fotoğraf seç veya dosya ekle</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        try {
                                                            setIsUploadingImage(true);
                                                            const uploadedUrl = await imageService.uploadImage(file);
                                                            setValue('coverImageUrl', uploadedUrl, { shouldDirty: true });
                                                        } catch (error) {
                                                            console.error("Image upload failed", error);
                                                            alert("Yükleme başarısız oldu. Lütfen tekrar deneyiniz.");
                                                        } finally {
                                                            setIsUploadingImage(false);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF en fazla 5MB</p>
                                    </div>
                                )}
                            </div>
                            <input type="hidden" {...register('coverImageUrl')} />
                        </div>
                    </div>
                    {errors.root && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm font-medium text-center">
                            {errors.root.message}
                        </div>
                    )}
                    <div className="flex gap-4 pt-6 border-t border-gray-100">
                        <Link
                            to="/coaches/dashboard"
                            className="px-8 py-3 border border-gray-300 text-[#0B1628] rounded-md font-bold tracking-widest hover:bg-gray-50 transition uppercase text-sm flex items-center justify-center"
                        >
                            İptal
                        </Link>
                        <button
                            type="submit"
                            disabled={isUpdating || !isDirty}
                            className="flex-1 bg-[#C9A84C] text-[#0B1628] py-3 rounded-md font-bold tracking-widest hover:bg-[#e0bb5a] transition disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm shadow-md"
                        >
                            {isUpdating ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}
export default UpdateLessonPackagePage;