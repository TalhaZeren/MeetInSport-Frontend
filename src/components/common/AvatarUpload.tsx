import React, { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Camera, Loader2 } from 'lucide-react';
import { imageService } from '../../api/services/imageService';
import { userService } from '../../api/services/userService';
import { useAuthStore } from '../../features/auth/authStore';


const AvatarUpload = () => {

    const {avatarUrl, name, updateAvatarInStore} = useAuthStore();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const {mutate : updateProfileAvatar, isPending : isUpdating} = useMutation({
        mutationFn : userService.updateAvatar,
        onSuccess : (newUrl) => {
            updateAvatarInStore(newUrl);
        },
        onError : () => {
            alert("Profil fotoğrafı güncellenirken bir hara meydana geld.");
        }
    });
    const {mutate : uploadImage, isPending : isUploading} = useMutation({
        mutationFn : imageService.uploadImage,
        onSuccess : (imageUrl) => {
            updateProfileAvatar(imageUrl);
        },
        onError : () => {
            alert("Resim Yüklenemedi.");
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file){
            uploadImage(file);
        }
    };

    const isLoading = isUploading || isUpdating;


     return (
        <div className="relative inline-block group">
            {/* The hidden file input */}
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            {/* The Avatar Display */}
            <div 
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative bg-gray-100 flex items-center justify-center cursor-pointer"
                onClick={() => !isLoading && fileInputRef.current?.click()}
            >
                {isLoading ? (
                    <Loader2 className="w-8 h-8 text-[#E8500A] animate-spin" />
                ) : avatarUrl ? (
                    <img src={avatarUrl} alt="Profil Resmi" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-3xl font-bold text-gray-400">
                        {name ? name.charAt(0).toUpperCase() : '?'}
                    </span>
                )}
                
                {/* Hover overlay that shows the camera icon */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-8 h-8 text-white" />
                </div>
            </div>
        </div>
    );
    
};
export default AvatarUpload;