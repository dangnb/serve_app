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
    public class PermissionGroupService : BaseService<PermissionGroup, string>, IPermissionGroupService
    {
        public PermissionGroupService(string sessionFactoryConfigPath, string connectionString = null) : base(sessionFactoryConfigPath, connectionString)
        {
        }
    }
}