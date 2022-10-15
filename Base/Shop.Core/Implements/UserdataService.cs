using SessionManager;
using Shop.Core.Domain;
using Shop.Core.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Core.Implements
{
    public class UserdataService : BaseService<Userdata, int>, IUserdataService
    {
        public UserdataService(string sessionFactoryConfigPath, string connectionString = null) : base(sessionFactoryConfigPath, connectionString)
        {
        }

        public Userdata Authenticate(string groupcode, string username, string password)
        {
            var user = GetbyName(groupcode, username);
            if (user == null) return null;
            string hashPassword = CommonUtils.EncodePassword(password, user.PasswordSalt);
            if (user.IsActive && !user.IsLocked && !user.IsDeleted && user.Password.Equals(hashPassword)) return user;
            return null;
        }

        public Userdata GetbyName(string groupcode, string username)
        {
            return Get(p => p.GroupCode == groupcode && p.Username == username);
        }

        public bool ChangePassword(Userdata userdata, string password, string newpassword, out string message)
        {
            message = "";
            string hashPassword = CommonUtils.EncodePassword(password, userdata.PasswordSalt);
            if (userdata.Password != hashPassword)
            {
                message = "Mật khẩu không hợp lệ";
                return false;
            }
            string hashNewPassword = CommonUtils.EncodePassword(newpassword, userdata.PasswordSalt);
            userdata.Password = hashNewPassword;
            userdata.IsActive = true;
            userdata.IsDeleted = false;
            userdata.IsLocked = false;
            userdata.FailedPassAttemptCount = 0;
            userdata.ModifiedDate = DateTime.Now;
            Update(userdata);
            CommitChanges();
            return true;
        }

        public IList<Userdata> GetbyFilter(string groupcode, string keyword, int pageindex, int pagesize, out int total)
        {
            var query = Query.Where(p => p.GroupCode == groupcode);
            if (!string.IsNullOrWhiteSpace(keyword))
                query = query.Where(p => p.Username.Contains(keyword) || p.FullName.Contains(keyword));
            query = query.OrderByDescending(p => p.UserID);
            int maxtemp = pageindex <= 1 ? 4 - pageindex : 2;//load tối đa 2 trang tiếp theo, nếu page =1 hoặc 2 thì sẽ load 4 trang hoặc 3 trang
            var ret = query.Skip(pageindex * pagesize).Take(pagesize * maxtemp + 1).ToList();
            total = pageindex * pagesize + ret.Count;
            return ret.Take(pagesize).ToList();
        }
    }
}
