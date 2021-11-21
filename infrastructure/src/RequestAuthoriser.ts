export interface RequestAuthoriser {

    authorise(token: string): Promise<any>

}