using SessionManager;
using Shop.Core.Domain;
using Shop.Core.IServices;
using System;

namespace Shop.Core.Implements
{
    public class CompanyService : BaseService<Company, int>, ICompanyService
    {
        public CompanyService(string sessionFactoryConfigPath, string? connectionString = null) : base(sessionFactoryConfigPath, connectionString)
        {
        }

        public Company? GetbyCode(string code) => Get(p => p.Code == code);

        public Company GetbyTaxCode(string taxCode) => Get(p => p.TaxCode == taxCode);

        public Company? GetbyToken(string token)=> Get(p => p.TokenKey == token);
    }
}
