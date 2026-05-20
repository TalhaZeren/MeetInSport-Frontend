export interface SportResponse{
    id :string; // Maps to the C# Guid
    name: string;
}
export interface CoachResponse{
    id : string; 
    fullName : string;
    email : string;
    sport : string; 
    bio? : string;
    hourlyRate : number; x
    experience: number;
    avarageRating : number;
    location?: string;
    // check the types whether they are correct or not
}

export interface UpdateCoachProfileRequest{ // PUT Request for profile update
    sportId : string;
    bio :string;
    hourlyRate : number;
    experience: number; 
    location : string;
    iban : string;
}

export interface CreateLessonPackageRequest{
    packageName : string;
    packageDescription : string;    
    durationInMinutes : number;
    packagePrice : number;
    requirements : string;
    locationType : string; 
    lessonModel : string;
    coverImageUrl : string;
    expirationDays : number;
}

export interface LessonPackageResponse {
    id : string;
    coachId : string;
    packageName : string; 
    packageDescription : string;
    durationInMinutes : number;
    packagePrice : number;
    requirements : string[];
    locationType : string; 
    lessonModel : string;
    coverImageUrl : string;
    isActive : boolean;
    expirationDays : number;
}

export const ReservationStatus = {
    Pending: 1,
    Confirmed: 2, 
    Cancelled: 3, 
    Completed: 4, 
    Refunded: 5
} as const;

export type ReservationStatus = typeof ReservationStatus[keyof typeof ReservationStatus];

export interface CreateReservationRequest {
    packageId : string;
    scheduleAt : string; 
    locationType : number ;
    notes? : string;
}


export interface CancelReservationRequest {
    cancelReason : string;
}


export interface ReservationResponse {
  id: string;
  packageId: string;
  coachId: string;
  scheduledAt: string;  // matches API response field name
  status: string;
  locationType: string;
  notes?: string;
  createdAt: string;
  packageName : string;
  coachName: string;
  studentName : string;
  expirationAt : string;
}

export interface UpdateLessonPackageRequest {

    packageName : string;
    packageDescription : string;    
    durationInMinutes : number;
    packagePrice : number;
    requirements : string[];
    locationType : string; 
    lessonModel : string;
    coverImageUrl : string;
    isActive : boolean;
    expirationDays : number;  
}

