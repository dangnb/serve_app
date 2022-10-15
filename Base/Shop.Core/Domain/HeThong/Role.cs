using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shop.Core.Domain
{
    public class Role
    {
        public virtual int RoleID { get; set; }
        public virtual int ComID { get; set; }
        public virtual string Code { get; set; }
        public virtual string Name { get; set; }
        public virtual bool IsSysadmin { get; set; } = false;
        public virtual IList<Permission> Permissions { get; set; } = new List<Permission>();
    }
}
