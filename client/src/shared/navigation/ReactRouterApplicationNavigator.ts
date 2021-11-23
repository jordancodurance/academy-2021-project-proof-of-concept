import {ApplicationNavigator} from "./ApplicationNavigator";
import {NavigateFunction} from "react-router";

export class ReactRouterApplicationNavigator extends ApplicationNavigator {

    private readonly navigator: NavigateFunction;

    constructor(navigator: NavigateFunction) {
        super();
        this.navigator = navigator;
    }

    navigateToHome(): void {
        this.navigator(ApplicationNavigator.HOME_ROUTE);
    }

    navigateToLogin(): void {
        this.navigator(ApplicationNavigator.LOGIN_ROUTE);
    }

}