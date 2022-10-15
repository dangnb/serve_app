
using FX.Core;

namespace Shop.Core
{
    public class FXContext : IFXContext
    {
        public static IFXContext Current
        {
            get { return IoC.Resolve<IFXContext>(); }
        }
        public string? PhysicalSiteDataDirectory { get; set; }
    }
}
