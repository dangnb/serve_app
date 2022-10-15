using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Core.Domain
{
    public class Userdata
    {
        public virtual int UserID { get; set; }
        public virtual string Username { get; set; }
        public virtual string FullName { get; set; }
        public virtual string Email { get; set; }
        public virtual string Password { get; set; }
        public virtual string PasswordSalt { get; set; }
        public virtual string HashAlgorithm { get; set; } = "SHA256";
        public virtual bool IsLocked { get; set; }
        public virtual bool IsActive { get; set; }
        public virtual bool IsDeleted { get; set; }
        public virtual DateTime CreateDate { get; set; } = DateTime.Now;
        public virtual DateTime ModifiedDate { get; set; } = DateTime.Now;
        public virtual int FailedPassAttemptCount { get; set; } = 0;
        public virtual string GroupCode { get; set; }
        public virtual string Policy { get; set; }

        public virtual IList<Role> Roles { get; set; } = new List<Role>();
    }
}
