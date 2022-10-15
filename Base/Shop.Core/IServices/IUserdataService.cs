using SessionManager;
using Shop.Core.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Core.IServices
{
    public interface IUserdataService : IBaseService<Userdata, int>
    {
        Userdata Authenticate(string groupcode, string username, string password);

        Userdata GetbyName(string groupcode, string username);

        bool ChangePassword(Userdata userdata, string password, string newpassword, out string message);

        IList<Userdata> GetbyFilter(string groupcode, string keyword, int pageindex, int pagesize, out int total);
    }
}
