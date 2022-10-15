using SessionManager;
using Shop.Core.Domain;
using System;

namespace Shop.Core.IServices
{
    public interface ICompanyService : IBaseService<Company, int>
    {
        Company GetbyTaxCode(string taxCode);
        Company GetbyCode(string code);
        Company GetbyToken(string token);
    }
}
