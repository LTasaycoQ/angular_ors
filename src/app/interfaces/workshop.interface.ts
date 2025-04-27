export interface Workshop {
    id: number;
    name: string;
    description?: string;
    dateStart: Date;
    dateEnd: Date;
    active: boolean;
}

// Interfaces actualizadas
export interface WorkshopRequestDto {
    name: string;
    description: string;
    dateStart: Date;
    dateEnd: Date;
}

export interface WorkshopResponseDto {
    id: number;
    name: string;
    description?: string;
    dateStart: string;
    dateEnd: string;
    status: string;
}

