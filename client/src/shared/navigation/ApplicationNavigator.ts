export abstract class ApplicationNavigator {

    public static readonly LOGIN_ROUTE = '/login';
    public static readonly HOME_ROUTE = '/home';

    abstract navigateToLogin(): void;

    abstract navigateToHome(): void;

}