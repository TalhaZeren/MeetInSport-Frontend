export const ENDPOINTS = {

    AUTH: {
        LOGIN:    '/auth/login',
        REGISTER: '/auth/register',
    },

    COACHES: {
        BASE:       '/coaches',
        PROFILE:    '/coaches/profile',
        ME:         '/coaches/me',
        BY_ID:      (id: string) => `/coaches/${id}`,
    },
    PACKAGES: {
        BASE:           '/packages',
        BY_COACH_ID:    (coachId: string) => `/packages/coach/${coachId}`,
        BY_ID:          (packageId: string) => `/packages/${packageId}`,
    },

    IMAGES: {
        UPLOAD: '/images/upload',
    },

    SPORTS: {
        BASE: '/sports',
    },

    RESERVATIONS: {
        BASE:       '/reservation',
        ME :        '/reservation/me',
        BY_ID:      (id: string) => `/reservation/${id}`,
        CANCEL:     (id: string) => `/reservation/${id}/cancel`,
        CONFIRM :   (id: string) => `/reservation/${id}/confirm`,
    },
    
} as const;
