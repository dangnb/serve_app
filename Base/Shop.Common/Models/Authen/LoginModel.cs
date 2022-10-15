using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Common.Models.Authen
{
    public class LoginModel
    {
        public string Taxcode { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class ChangePasswordModel
    {
        public string password { get; set; }
        public string newpassword { get; set; }
        public string confirmpassword { get; set; }
    }
}
