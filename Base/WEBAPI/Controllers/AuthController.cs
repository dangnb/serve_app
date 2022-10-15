using Authen.JWT;
using FX.Core;
using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.Common.Models;
using Shop.Common.Models.Authen;
using Shop.Core.IServices;

namespace WEBAPI.Controllers
{
    public class AuthController: ControllerBase
    {
        private ILog _log = LogManager.GetLogger(typeof(AuthController));

        private IConfiguration _config;
        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody]LoginModel model)
        {
            try
            {
                ICompanyService compservice = IoC.Resolve<ICompanyService>();
                IUserdataService service = IoC.Resolve<IUserdataService>();
                var a= compservice.Query.ToList();
                var company = compservice.GetbyTaxCode(model.Taxcode);
                if (company == null) return Unauthorized();
                var userdata = service.Authenticate(company.TokenKey, model.Username, model.Password);
                if (userdata == null) return Unauthorized();
                JwtManager manager = new JwtManager(_config);
                var token = manager.GenerateToken(company.TokenKey, model.Username);
                var result = new UserModel() { UserID = userdata.UserID, UserName = userdata.Username, FullName = userdata.FullName, Email = userdata.Email, GroupCode = userdata.GroupCode, JwtToken = token };
                return Ok(result);
            }
            catch (Exception ex)
            {
                _log.Error(ex);
                return Unauthorized();
            }
        }
    }
}
