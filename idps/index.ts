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
            providerName: 'azure-sbx-idp-test',
            metadataUrl: 'https://login.microsoftonline.com/b423814a-f53b-44da-9058-607a26e1e8ae/federationmetadata/2007-06/federationmetadata.xml?appid=786af84c-341c-4563-a612-90243ec03520',
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