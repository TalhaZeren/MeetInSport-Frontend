export interface SportResponse{
    id :string; // Maps to the C# Guid
    name: string;
}
export interface CoachResponse{
    id : string; 
    fullName : string;
    sport : string; 
    bio? : string;
    hourlyRate : number; 
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