import { IdpConfigType } from "./types";

export interface ConfigEnvironmentType {
    sbx: IdpConfigType[],
    dev: IdpConfigType[],
    prod: IdpConfigType[]
}

const idpConfig: ConfigEnvironmentType = {
    sbx: [
        {
            identifierName: 'AzureSbxSamlProvider',
            providerName: 'azure-sbx-idp',
            metadataUrl: 'https://login.microsoftonline.com/099802f6-21a8-4a5a-9c40-a0244b58a711/federationmetadata/2007-06/federationmetadata.xml?appid=3ebb2efc-af8e-4717-b58d-63b96edb7e18',
            attributes: {
                email: 'emails',
                family_name: 'name.familyName',
                given_name: 'name.givenName',
                middle_name: 'name.familyName',
                name: 'name.formatted',
                'custom:attribute1': 'pdaidomain',
            },
            providerType: 'SAML',
            userpoolId: ''
        }
    ],
    dev: [
        {
            identifierName: '',
            providerName: '',
            metadataUrl: '',
            attributes: {},
            providerType: '',
            userpoolId: ''
        }
    ],
    prod: [
        {
            identifierName: '',
            providerName: '',
            metadataUrl: '',
            attributes: {},
            providerType: '',
            userpoolId: ''
        }
    ]
}

export default idpConfig;