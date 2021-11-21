import {NavigateFunction} from "react-router";

export class ApplicationNavigator {
    private readonly navigator: NavigateFunction;

    constructor(navigator: NavigateFunction) {
        this.navigator = navigator;
    }

    public navigateToLogin() {
        this.navigator('/login');
    }

    public navigateToHome() {
        this.navigator('/home');
    }
}