export class LoginScreenModel {
    private username: string = '';
    private password: string = '';

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
}