//Customize to get userID from request
declare namespace Express {
    export interface Request {
        userId: string;
    }
}