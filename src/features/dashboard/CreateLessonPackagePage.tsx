import {useForm} from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { lessonPackageService } from '../../api/services/lessonPackageService';
import {useState} from 'react';
import { imageService } from '../../api/services/imageService';

const packageSchema = z.object({
    packageName: z.string().min(1, 'Paket adı gereklidir.'),
    packageDescription: z.string().max(500, 'Paket açıklaması en fazla 500 karakter olabilir.'),
    durationInMinutes  : z.number().min(15, 'Ders süresi en az 15 dakika olmalıdır.'),
    packagePrice : z.number().min(1, 'Fiyat pozitif bir sayı olmalıdır'),
    requirements : z.string().optional(),
    locationType : z.number().min(1, "Lütfen bir konum türü seçiniz."),
    lessonModel : z.number().min(1, "Lütfen bir ders modeli seçiniz."),
    coverImageUrl : z.string().optional(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

const CreateLessonPackagePage = () => {
    const navigate = useNavigate();
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // REact HookForm

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        formState : {errors, isDirty}
    } = useForm<PackageFormValues>({
        resolver : zodResolver(packageSchema),
        defaultValues : {
            packageName : '',
            packageDescription : '',
            durationInMinutes : 60,
            packagePrice : 0,
            requirements : '',
            locationType : 0,
            lessonModel : 0,
            coverImageUrl : '',
        }
    });


    // Tanstack React Query

    const {mutate : createPackage, isPending} = useMutation({
        mutationFn : lessonPackageService.createPackage,
        onSuccess : () => {
            alert('Ders Paketi Başarıyla Oluşturuldu!');
            navigate('coach/dashboard');
        },
        onError : (error: any) => {
            console.error("Ders Paketi oluşturulurken hata oluştu");
            setError('root', { 
            message: error.response?.data?.message || "Ders Paketi oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz." 
      });
        }
    });

    const onSubmit = (data : PackageFormValues) => {
    // We take the comma-separated string from the form, split it, and trim the whitespace.
        const requirementsArray = data.requirements ? data.requirements.split(',').map(item => item.trim()).filter(item => item.length > 0) : [];
        // After the arrangement, we are gonna build the exact payload that our api expects 
        const payload = {
            packageName: data.packageName,
            packageDescription : data.packageDescription,
            durationInMinutes : data.durationInMinutes,
            packagePrice : data.packagePrice, 
            requirements : requirementsArray,  // We converted into array by seperating with comma.
            locationType : data.locationType,
            lessonModel :  data.lessonModel,
            coverImageUrl : data.coverImageUrl || undefined,
        };
        createPackage(payload as any);
    };
return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      
      <Link to="/coaches/dashboard" className="text-[#8A96A3] font-semibold hover:text-[#0B1628] mb-6 flex items-center transition">
        &larr; Arayüze Dön
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#0B1628]">Yeni Ders Paketi Oluştur</h1>
        <p className="text-[#8A96A3] mt-2">Ders paketini oluşturmak için aşağıdaki alanları doldurunuz.</p>
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
              <label className="block text-sm font-medium text-[#0B1628] uppercase tracking-wide mb-2">Price (₺)</label>
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

      
            {/* Lesson Model (Enum) */}
            <div>
              <label className="block text-sm font-medium text-[#0B1628] uppercase tracking-wide mb-2">Lesson Format</label>
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

           {/* Location Type (Enum) */}
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

            {/* Requirements (Comma separated) */}
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
              <label className="block text-sm font-medium text-[#0B1628] uppercase tracking-wide mb-2">
                Fotoğraf (Opsiyonel)
              </label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#C9A84C] transition-colors relative group overflow-hidden bg-gray-50">
                
                {/* 1. Loading State */}
                {isUploadingImage ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-8 h-8 border-4 border-[#093A32] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 mt-4 animate-pulse">Uploading image securely...</p>
                  </div>
                ) : 
                
                /* 2. Success State (Show the Image) */
                watch('coverImageUrl') ? (
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
                      Remove Image
                    </button>
                  </div>
                ) : 
                
                /* 3. Empty State (Upload Button) */
                (
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
                              // Send file to C# backend
                              const uploadedUrl = await imageService.uploadImage(file);
                              // Save the resulting URL into React Hook Form!
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
              
              {/* Hidden input to ensure Zod validation tracks it correctly */}
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
              disabled={isPending || !isDirty}
              className="flex-1 bg-[#C9A84C] text-[#0B1628] py-3 rounded-md font-bold tracking-widest hover:bg-[#e0bb5a] transition disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm shadow-md"
            >
              {isPending ? "Paket Oluşturuluyor..." : "Paketi Oluştur"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
export default CreateLessonPackagePage