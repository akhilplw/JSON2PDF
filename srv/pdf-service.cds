using { cuid } from '@sap/cds/common';

service CatalogService {
    // @requires: 'authent
     @requires: 'API_Access'
    action downloadPDF(input: String) returns LargeBinary @Core.MediaType: 'application/pdf';
}
