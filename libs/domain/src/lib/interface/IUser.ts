export interface IUser {
    getPasswordHash(): Promise<string>;
}