
import apiClient from './api';

class CompanyService {
 getAllCompanies ()  {
  return apiClient.get("/companies");
}

 deleteCompany  (companyId) {
  return apiClient.delete(`/companies/${companyId}`);
}

}

export default new CompanyService();
