using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Castle.Windsor.Configuration.Interpreters;
using FX.Core;
using Shop.Core;

namespace WEBAPI
{
    public class Bootstrapper
    {
        private static IWindsorContainer container;
        public static void InitializeContainer(string servicesPath)
        {
            try
            {
                servicesPath = AppDomain.CurrentDomain.BaseDirectory + servicesPath;
                // Initialize Windsor
                container = new WindsorContainer(new XmlInterpreter(servicesPath));

                // Inititialize the static Windsor helper class. 
                IoC.Initialize(container);

                // Add ICuyahogaContext to the container.
                container.Register(Component.For<IFXContext>()
                    .ImplementedBy<FXContext>()
                    .Named("FX.context")
                );
            }
            catch (Exception ex)
            {
                throw new Exception("Bootstrapper Error", ex);
            }
        }
    }
}
