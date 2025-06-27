export interface IdpConfigType {
    identifierName: string;
    providerName: string;
    providerType: string;
    metadataUrl: string;
    attributes: any;
    userpoolId?: string; // pass during initialization.
}