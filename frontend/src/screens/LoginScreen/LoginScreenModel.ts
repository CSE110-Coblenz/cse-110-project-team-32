export class LoginScreenModel {
    private username: string = '';
    private password: string = '';
    private userid!: number;

    setUsername(username: string): void {
        this.username = username;
    }

    setPassword(password: string): void {
        this.password = password;
    }

    getUsername(): string {
        return this.username;
    }

    getPassword(): string {
        return this.password;
    }

    clearCredentials(): void {
        this.username = '';
        this.password = '';
    }

    setUserId(userid: number): void{
        this.userid = userid;
    }

    getUserId(): number{
       return this.userid;
    }
}