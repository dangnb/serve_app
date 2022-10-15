using System;

namespace Shop.Core.Domain
{
    public class Company
    {
        public virtual int ID { get; set; }        
        public virtual string Code { get; set; }
        public virtual string TaxCode { get; set; }
        public virtual string Name { get; set; }
        public virtual string Address { get; set; }
        public virtual string Phone { get; set; }        
        public virtual string Email { get; set; }
        public virtual string Website { get; set; }
        public virtual int Status { get; set; }

        public virtual string TokenKey { get; set; } = Guid.NewGuid().ToString();

    }
}
