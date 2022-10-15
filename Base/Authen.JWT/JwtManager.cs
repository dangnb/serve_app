using FX.Core;
using log4net;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Shop.Core.Domain;
using Shop.Core.IServices;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Authen.JWT
{
    public class JwtManager
    {
        private static ILog log = LogManager.GetLogger(typeof(JwtManager));

        private IConfiguration _config;

        public JwtManager(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// tạo jwt token
        /// nếu chưa có tạo mới vào db
        /// nếu có rồi thì gia hạn và update vào db
        /// </summary>
        /// <param name="comId"></param>
        /// <param name="username"></param>        
        /// <param name="expireMinutes"></param>
        /// <returns></returns>
        public string GenerateToken(string comToken, string username)
        {
            try
            {
                string token = null;
                var now = DateTime.UtcNow;

                // generate jwt token
                var symmetricKey = Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]);
                var tokenHandler = new JwtSecurityTokenHandler();
                var expireMinutes = int.Parse(_config["Jwt:ExpiredTime"]);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Issuer = _config["Jwt:Issuer"],
                    Audience = _config["Jwt:Audience"],
                    Claims = new Dictionary<string, object>(),
                    Expires = now.AddMinutes(expireMinutes),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(symmetricKey), SecurityAlgorithms.HmacSha256Signature)
                };

                tokenDescriptor.Claims.Add(ClaimTypes.Name, username);
                tokenDescriptor.Claims.Add(ClaimTypes.Role, "");
                tokenDescriptor.Claims.Add(ClaimTypes.Hash, comToken);

                SecurityToken securityToken = tokenHandler.CreateToken(tokenDescriptor);
                token = tokenHandler.WriteToken(securityToken);

                return token;
            }
            catch (Exception ex)
            {
                log.Error(ex);
                return null;
            }
        }

        public Userdata ValidateToKen(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var symmetricKey = Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]);
            var validationParameters = new TokenValidationParameters()
            {
                RequireExpirationTime = false,
                ValidateIssuer = false,
                ValidateAudience = false,
                IssuerSigningKey = new SymmetricSecurityKey(symmetricKey)
            };
            SecurityToken securityToken;
            ClaimsPrincipal principal = tokenHandler.ValidateToken(token, validationParameters, out securityToken);
            if (securityToken != null && principal != null)
            {
                JwtSecurityToken jwtToken = (JwtSecurityToken)securityToken;
                var payload = jwtToken.Payload;
                if (payload.Count() > 0)
                {
                    IUserdataService service = IoC.Resolve<IUserdataService>();
                    var appuser = service.GetbyName(payload[ClaimTypes.Hash].ToString(), payload[ClaimTypes.Name].ToString());
                    if (appuser == null) return null;
                    return appuser;
                }
            }
            return null;
        }
    }

}
