using NHibernate;
using NHibernate.Cfg;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SessionManager.NHibernateSession
{
    public sealed class NHibernateSessionManager
    {
        #region Thread-safe, lazy Singleton

        /// <summary>
        /// This is a thread-safe, lazy singleton.  See http://www.yoda.arachsys.com/csharp/singleton.html
        /// for more details about its implementation.
        /// </summary>
        public static NHibernateSessionManager Instance
        {
            get
            {
                return Nested.NHibernateSessionManager;
            }
        }

        /// <summary>
        /// Private constructor to enforce singleton
        /// </summary>
        private NHibernateSessionManager()
        {
        }

        /// <summary>
        /// Assists with ensuring thread-safe, lazy singleton
        /// </summary>
        private class Nested
        {
            static Nested() { }
            internal static readonly NHibernateSessionManager NHibernateSessionManager =
                new NHibernateSessionManager();
        }

        #endregion

        static object looker = new object();
        /// <summary>
        /// This method attempts to find a session factory stored in <see cref="sessionFactories" />
        /// via its name; if it can't be found it creates a new one and adds it the hashtable.
        /// </summary>
        /// <param name="sessionFactoryConfigPath">Path location of the factory config</param>
        public ISessionFactory GetSessionFactoryFor(string sessionFactoryConfigPath)
        {
            lock (looker)
            {
                ISessionFactory sessionFactory = (ISessionFactory)sessionFactories[sessionFactoryConfigPath];

                //  Failed to find a matching SessionFactory so make a new one.
                if (sessionFactory == null)
                {
                    string connectString = string.Empty;
                    string PathFileConfig = sessionFactoryConfigPath;
                    string[] configs = sessionFactoryConfigPath.Split(new char[] { '#' }, StringSplitOptions.RemoveEmptyEntries);
                    if (configs.Length > 1)
                    {
                        connectString = configs[1];
                        PathFileConfig = configs[0];
                    }
                    //end adding
                    Configuration cfg = new Configuration();
                    cfg.Configure(PathFileConfig);
                    //sửa schema Name cho cfg
                    if (!string.IsNullOrWhiteSpace(connectString))
                    {
                        cfg.SetProperty(NHibernate.Cfg.Environment.ConnectionString, connectString);
                    }

                    sessionFactory = cfg.BuildSessionFactory();
                    //  Now that we have our Configuration object, create a new SessionFactory
                    if (sessionFactory == null)
                    {
                        throw new InvalidOperationException("cfg.BuildSessionFactory() returned null.");
                    }
                    sessionFactories.Add(sessionFactoryConfigPath, sessionFactory);
                }

                return sessionFactory;
            }
        }

        public ISession GetSessionFrom(string sessionFactoryConfigPath)
        {
            ISession session = (ISession)ContextSessions[sessionFactoryConfigPath];

            if (session == null)
            {
                session = GetSessionFactoryFor(sessionFactoryConfigPath).OpenSession();
                ContextSessions[sessionFactoryConfigPath] = session;
            }
            return session;
        }

        public IStatelessSession GetSessionStateLessFrom(string sessionFactoryConfigPath)
        {
            IStatelessSession session = (IStatelessSession)ContextSessionsStateLess[sessionFactoryConfigPath];

            if (session == null)
            {
                session = GetSessionFactoryFor(sessionFactoryConfigPath).OpenStatelessSession();
                ContextSessionsStateLess[sessionFactoryConfigPath] = session;
            }
            return session;
        }

        /// <summary>
        /// Flushes anything left in the session and closes the connection.
        /// </summary>
        public void CloseSessionOn(string sessionFactoryConfigPath)
        {
            ISession session = (ISession)ContextSessions[sessionFactoryConfigPath];
            if (session != null && session.IsOpen)
            {
                try
                {
                    session.Flush();
                }
                catch { }

                session.Close();
            }
            ContextSessions.Remove(sessionFactoryConfigPath);
        }


        /// <summary>
        /// not Flushes anything  in the session and closes the connection. Create By Duyet for rolback session
        /// </summary>
        public void CloseSession(string sessionFactoryConfigPath)
        {
            ISession session = (ISession)ContextSessions[sessionFactoryConfigPath];
            if (session != null && session.IsOpen)
            {
                session.Close();
            }
            ContextSessions.Remove(sessionFactoryConfigPath);
        }

        public void CloseSessionStateless(string sessionFactoryConfigPath)
        {
            ISession session = (ISession)ContextSessionsStateLess[sessionFactoryConfigPath];
            if (session != null && session.IsOpen)
            {
                session.Close();
            }
            ContextSessionsStateLess.Remove(sessionFactoryConfigPath);
        }

        public ITransaction BeginTransactionOn(string sessionFactoryConfigPath)
        {
            ITransaction transaction = (ITransaction)ContextTransactions[sessionFactoryConfigPath];

            if (transaction == null)
            {
                transaction = GetSessionFrom(sessionFactoryConfigPath).BeginTransaction();
                ContextTransactions.Add(sessionFactoryConfigPath, transaction);
            }
            return transaction;
        }

        public ITransaction BeginTransactionStateLessOn(string sessionFactoryConfigPath)
        {
            ITransaction transaction = (ITransaction)ContextTransactionsStateLess[sessionFactoryConfigPath];

            if (transaction == null)
            {
                transaction = GetSessionStateLessFrom(sessionFactoryConfigPath).BeginTransaction();
                ContextTransactionsStateLess.Add(sessionFactoryConfigPath, transaction);
            }
            return transaction;
        }

        public void CommitTransactionOn(string sessionFactoryConfigPath)
        {
            try
            {
                ITransaction transaction = (ITransaction)ContextTransactions[sessionFactoryConfigPath];

                if (HasOpenTransactionOn(sessionFactoryConfigPath))
                {
                    transaction.Commit();
                    ContextTransactions.Remove(sessionFactoryConfigPath);
                }
            }
            catch (HibernateException)
            {
                RollbackTransactionOn(sessionFactoryConfigPath);
                throw;
            }
        }

        public void CommitTransactionStateLessOn(string sessionFactoryConfigPath)
        {
            try
            {
                ITransaction transaction = (ITransaction)ContextTransactionsStateLess[sessionFactoryConfigPath];

                if (HasOpenTransactionOn(sessionFactoryConfigPath))
                {
                    transaction.Commit();
                    ContextTransactionsStateLess.Remove(sessionFactoryConfigPath);
                }
            }
            catch (HibernateException)
            {
                RollbackTransactionStateLessOn(sessionFactoryConfigPath);
                throw;
            }
        }

        public bool HasOpenTransactionOn(string sessionFactoryConfigPath)
        {
            ITransaction transaction = (ITransaction)ContextTransactions[sessionFactoryConfigPath];
            return transaction != null && !transaction.WasCommitted && !transaction.WasRolledBack;
        }

        public void RollbackTransactionStateLessOn(string sessionFactoryConfigPath)
        {
            try
            {
                ITransaction transaction = (ITransaction)ContextTransactionsStateLess[sessionFactoryConfigPath];
                if (HasOpenTransactionOn(sessionFactoryConfigPath))
                {
                    transaction.Rollback();
                }
                ContextTransactionsStateLess.Remove(sessionFactoryConfigPath);
            }
            finally
            {
                CloseSessionStateless(sessionFactoryConfigPath);
            }
        }
        public void RollbackTransactionOn(string sessionFactoryConfigPath)
        {
            try
            {
                ITransaction transaction = (ITransaction)ContextTransactions[sessionFactoryConfigPath];
                if (HasOpenTransactionOn(sessionFactoryConfigPath))
                {
                    transaction.Rollback();
                }
                ContextTransactions.Remove(sessionFactoryConfigPath);
            }
            finally
            {
                CloseSession(sessionFactoryConfigPath);
            }
        }


        /// <summary>
        /// Since multiple databases may be in use, there may be one session per database 
        /// persisted at any one time. The easiest way to store them is via a hashtable
        /// with the key being tied to session factory.
        /// </summary>

        private Hashtable ContextSessions
        {
            get
            {
                if (CallContext<Hashtable>.GetData(CONTEXT_SESSION_KEY) == null)
                {
                    CallContext<Hashtable>.SetData(CONTEXT_SESSION_KEY, new Hashtable());
                }

                return CallContext<Hashtable>.GetData(CONTEXT_SESSION_KEY);
            }
        }

        private Hashtable ContextSessionsStateLess
        {
            get
            {
                string key = "STATELESS_" + CONTEXT_SESSION_KEY;
                if (CallContext<Hashtable>.GetData(key) == null)
                {
                    CallContext<Hashtable>.SetData(key, new Hashtable());
                }

                return CallContext<Hashtable>.GetData(key);
            }
        }

        private Hashtable ContextTransactions
        {
            get
            {
                if (CallContext<Hashtable>.GetData(CONTEXT_TRANSACTION_KEY) == null)
                {
                    CallContext<Hashtable>.SetData(CONTEXT_TRANSACTION_KEY, new Hashtable());
                }

                return CallContext<Hashtable>.GetData(CONTEXT_TRANSACTION_KEY);
            }
        }

        private Hashtable ContextTransactionsStateLess
        {
            get
            {
                string key = "STATELESS_" + CONTEXT_TRANSACTION_KEY;
                if (CallContext<Hashtable>.GetData(key) == null)
                {
                    CallContext<Hashtable>.SetData(key, new Hashtable());
                }

                return CallContext<Hashtable>.GetData(key);
            }
        }

        public bool IsStateLess
        {
            get
            {
                return CallContext<Boolean>.GetData(STATE_SESSION_KEY);
            }
            set
            {
                CallContext<Boolean>.SetData(STATE_SESSION_KEY, value);
            }
        }

        private Hashtable sessionFactories = new Hashtable();

        private const string STATE_SESSION_KEY = "STATE_SESSIONS";
        private const string CONTEXT_TRANSACTION_KEY = "CONTEXT_TRANSACTIONS";
        private const string CONTEXT_SESSION_KEY = "CONTEXT_SESSIONS";
    }
}
