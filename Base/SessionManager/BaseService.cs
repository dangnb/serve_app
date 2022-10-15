using NHibernate;
using NHibernate.Criterion;
using NHibernate.Transform;
using SessionManager.NHibernateSession;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace SessionManager
{
    public class BaseService<T, IdT> : IBaseService<T, IdT>
    {
        public BaseService(string sessionFactoryConfigPath, string connectionString = null)
        {
            if (!string.IsNullOrWhiteSpace(connectionString))
                SessionFactoryConfigPath = SessionFactoryConfigPath + "#" + connectionString.Trim();
            if (!sessionFactoryConfigPath.Contains(AppDomain.CurrentDomain.BaseDirectory))
                SessionFactoryConfigPath = AppDomain.CurrentDomain.BaseDirectory + @"" + sessionFactoryConfigPath;
            else SessionFactoryConfigPath = sessionFactoryConfigPath;
        }

        /// <summary>
        /// CreateNew object 
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public virtual async Task<T> CreateNew(T entity)
        {
            if (!isStateLess)
                await NHibernateSession.SaveAsync(entity);
            else
                await NHibernateSessionStateLess.InsertAsync(entity);
            return entity;
        }
        public virtual async Task<T> Delete(T entity)
        {
            if (!isStateLess) await NHibernateSession.DeleteAsync(entity);
            else await NHibernateSessionStateLess.DeleteAsync(entity);
            return entity;
        }
        public virtual async Task<T> Delete(IdT key)
        {
            T? entity = await Getbykey(key);
            return await Delete(entity);
        }

        public virtual async Task<T> Update(T entity)
        {
            if (!isStateLess) await NHibernateSession.UpdateAsync(entity);
            else await NHibernateSessionStateLess.UpdateAsync(entity);
            return entity;
        }
        public virtual async Task<T> Save(T entity)
        {
            if (!isStateLess) await NHibernateSession.SaveOrUpdateAsync(entity);
            else await NHibernateSessionStateLess.InsertAsync(entity);
            return entity;
        }

        public virtual async Task<R> ExecuteScalar<R>(string Query, bool isHQL, params SQLParam[] _params)
        {
            IQuery q = isHQL ? NHibernateSession.CreateQuery(Query) : NHibernateSession.CreateSQLQuery(Query);
            foreach (SQLParam _para in _params)
            {
                q.SetParameter(_para.ParameName, _para.ParamValue);
            }
            return (R)(await q.ListAsync<R>()).Single();
        }

        public async Task<IList<R>> GetbyQuery<R>(string query, bool hql, params SQLParam[] _params)
        {
            var iQuery = hql ? NHibernateSession.CreateQuery(query) : NHibernateSession.CreateSQLQuery(query);
            foreach (SQLParam _para in _params)
            {
                iQuery.SetParameter(_para.ParameName, _para.ParamValue);
            }
            return await iQuery.SetResultTransformer(Transformers.AliasToBean<R>()).ListAsync<R>();
        }

        /// <summary>
        /// Loads an instance of type T from the DB based on its ID.
        /// </summary>
        public virtual async Task<T> Getbykey(IdT key)
        {
            object entity;
            if (!isStateLess)
                entity = await NHibernateSession.GetAsync(persitentType, key);
            else
            {
                T? t = await NHibernateSessionStateLess.GetAsync<T>(key);
                entity = t;
            }

            return (entity == null) ? default(T) : (T)entity;
        }

        /// <summary>
        /// Loads every instance of the requested type using the supplied <see cref="ICriterion" />.
        /// If no <see cref="ICriterion" /> is supplied, this behaves like <see cref="GetAll" />.
        /// </summary>
        public virtual async Task<List<T>?> GetByCriteria(params ICriterion[] criterion)
        {
            ICriteria criteria;
            if (!isStateLess)
                criteria = NHibernateSession.CreateCriteria(persitentType);
            else
                criteria = NHibernateSessionStateLess.CreateCriteria(persitentType);
            foreach (ICriterion criterium in criterion)
            {
                criteria.Add(criterium);
            }
            return await GetByCriteria(criteria);
        }

        public virtual async Task<List<T>?> GetByCriteria(ICriteria _crit)
        {
            if (_fromIndex >= 0 && _MaxResult > 0)
            {
                _crit.SetFirstResult(_fromIndex);
                _crit.SetMaxResults(_MaxResult);
                List<T>? ret = await _crit.ListAsync<T>() as List<T>;
                ResetFetchPage();
                return ret;
            }
            else return await _crit.ListAsync<T>() as List<T>;
        }

        public virtual ICriteria CreateCriteria()
        {
            return NHibernateSession.CreateCriteria(persitentType);
        }

        public async Task<List<T>?> GetbySQLQuery(string Query, params SQLParam[] _params)
        {
            IQuery q = NHibernateSession.CreateSQLQuery(Query).AddEntity(typeof(T));
            foreach (SQLParam _para in _params)
            {
                q.SetParameter(_para.ParameName, _para.ParamValue);
            }
            if (_fromIndex >= 0 && _MaxResult > 0)
            {
                q.SetFirstResult(_fromIndex);
                q.SetMaxResults(_MaxResult);
                List<T>? ret = await q.ListAsync<T>() as List<T>;
                ResetFetchPage();
                return ret;
            }
            return await q.ListAsync<T>() as List<T>;
        }

        public IList<T> GetbySQLQuery(string Query, int pageIndex, int pageSize, out int total, params SQLParam[] _params)
        {
            string totalSQL = Query;
            int i = Query.IndexOf("order by", StringComparison.OrdinalIgnoreCase);
            if (i >= 0)
                totalSQL = Query.Substring(0, i);
            string countQr = "select count(*) from (" + totalSQL + ") as ccc";
            total = ExecuteCountQuery(countQr, false, _params);
            IQuery q = NHibernateSession.CreateSQLQuery(Query).AddEntity(typeof(T));
            foreach (SQLParam _para in _params)
            {
                q.SetParameter(_para.ParameName, _para.ParamValue);
            }
            q.SetFirstResult((pageIndex - 1) * pageSize);
            q.SetMaxResults(pageSize);
            return q.List<T>() as IList<T>;
        }

        private int ExecuteCountQuery(string Query, bool isHQL, params SQLParam[] _params)
        {
            IQuery q = isHQL ? NHibernateSession.CreateQuery(Query) : NHibernateSession.CreateSQLQuery(Query);
            foreach (SQLParam _para in _params)
            {
                q.SetParameter(_para.ParameName, _para.ParamValue);
            }
            object rs = q.UniqueResult();
            int total = Convert.ToInt32(rs);
            return total;
        }

        public List<T> GetbyHQuery(string query, int pageIndex, int pageSize, out int total, params SQLParam[] _params)
        {
            string totalSQL = query;
            int i = query.IndexOf("order by", StringComparison.OrdinalIgnoreCase);
            if (i >= 0)
                totalSQL = query.Substring(0, i);
            int j = totalSQL.IndexOf("from", StringComparison.OrdinalIgnoreCase);
            if (j >= 0)
                totalSQL = totalSQL.Substring(j);
            string countQr = "select count(*) " + totalSQL;
            total = ExecuteCountQuery(countQr, true, _params);
            IQuery q = NHibernateSession.CreateQuery(query);
            foreach (SQLParam _para in _params)
            {
                q.SetParameter(_para.ParameName, _para.ParamValue);
            }
            q.SetFirstResult((pageIndex - 1) * pageSize);
            q.SetMaxResults(pageSize);
            List<T>? ret =  q.List<T>() as List<T>;
            return ret;
        }

        /// <summary>
        /// Fetch entity queryable
        /// </summary>
        /// <param name="predicate">Predicate expression</param>
        /// <returns>Queryable instance</returns>
        private IQueryable<T> Fetch(Expression<Func<T, bool>> predicate)
        {
            return Query.Where(predicate);
        }
        /// <summary>
        /// Get intity by expression
        /// </summary>
        /// <param name="predicate">Predicate expression</param>
        /// <returns>Entity</returns>
        public virtual T? Get(Expression<Func<T, bool>> predicate)
        {
            var results = Fetch(predicate).ToList();
            return (results.Count > 0) ? results[0] : default(T);
        }

        public async Task<IList<T>?> GetbyHQuery(string Query, params SQLParam[] _params)
        {
            IQuery q = NHibernateSession.CreateQuery(Query);
            foreach (SQLParam _para in _params)
            {
                q.SetParameter(_para.ParameName, _para.ParamValue);
            }
            if (_fromIndex >= 0 && _MaxResult > 0)
            {
                q.SetFirstResult(_fromIndex);
                q.SetMaxResults(_MaxResult);
                List<T>? ret = await q.ListAsync<T>() as List<T>;
                ResetFetchPage();
                return ret;
            }
            return await q.ListAsync<T>() as List<T>;
        }

        public virtual object ExcuteNonQuery(string SQLquery)
        {
            System.Data.IDbCommand cmd = NHibernateSession.Connection.CreateCommand();
            cmd.CommandText = SQLquery;
            cmd.CommandType = System.Data.CommandType.Text;
            return cmd.ExecuteNonQuery();
        }
        public object ExcuteNonQuery(string query, bool isHQL, params SQLParam[] _params)
        {
            IQuery q = isHQL ? NHibernateSession.CreateQuery(query) : NHibernateSession.CreateSQLQuery(query);
            foreach (SQLParam _para in _params)
            {
                q.SetParameter(_para.ParameName, _para.ParamValue);
            }
            int rowCount = q.ExecuteUpdate();
            return rowCount;
        }

        /// <summary>
        /// Commits changes regardless of whether there's an open transaction or not
        /// </summary>
        public void CommitChanges()
        {
            NHibernateSessionManager.Instance.GetSessionFrom(SessionFactoryConfigPath).Flush();
            /* 
             if (NHibernateSessionManager.Instance.HasOpenTransactionOn(SessionFactoryConfigPath))
             {
                 NHibernateSessionManager.Instance.CommitTransactionOn(SessionFactoryConfigPath);
             }
             else
             {
                 // If there's no transaction, just flush the changes
                 NHibernateSessionManager.Instance.GetSessionFrom(SessionFactoryConfigPath).Flush();
                 //NHibernateSession.Flush();
             }*/
        }

        public void Clear()
        {
            NHibernateSession.Clear();
        }

        /// <summary>
        /// Exposes the ISession used within the DAO.
        /// </summary>
        protected ISession NHibernateSession
        {
            get
            {
                ISession ret = NHibernateSessionManager.Instance.GetSessionFrom(SessionFactoryConfigPath);
                return ret;
            }
        }
        /// <summary>
        /// Exposes the ISession used within the DAO.
        /// </summary>
        protected IStatelessSession NHibernateSessionStateLess
        {
            get
            {
                IStatelessSession ret = NHibernateSessionManager.Instance.GetSessionStateLessFrom(SessionFactoryConfigPath);
                return ret;
            }
        }

        private Type persitentType = typeof(T);
        protected readonly string SessionFactoryConfigPath;
        public void BindSession(object _obj)
        {
            if (_obj is ICollection<T>)
            {
                foreach (T entity in (ICollection<T>)_obj) NHibernateSession.Persist(entity);
            }
            else
                NHibernateSession.Persist(_obj);
        }
        public void UnbindSession(object _obj)
        {
            if (_obj is ICollection<T>)
            {
                foreach (T entity in (ICollection<T>)_obj) NHibernateSession.Evict(entity);
            }
            else
                NHibernateSession.Evict(_obj);
        }

        public void UnbindSession()
        {
            NHibernateSession.Clear();
        }

        public void BeginTran()
        {
            if (!isStateLess)
                NHibernateSessionManager.Instance.BeginTransactionOn(SessionFactoryConfigPath);
            else NHibernateSessionManager.Instance.BeginTransactionStateLessOn(SessionFactoryConfigPath);
        }
        public void CommitTran()
        {
            if (!isStateLess)
                NHibernateSessionManager.Instance.CommitTransactionOn(SessionFactoryConfigPath);
            else NHibernateSessionManager.Instance.CommitTransactionStateLessOn(SessionFactoryConfigPath);
        }
        public void RolbackTran()
        {
            if (!isStateLess)
                NHibernateSessionManager.Instance.RollbackTransactionOn(SessionFactoryConfigPath);
            else NHibernateSessionManager.Instance.RollbackTransactionStateLessOn(SessionFactoryConfigPath);
        }

        public IQueryable<T> Query
        {
            get
            {
                if (!isStateLess) return NHibernateSession.Query<T>();
                else return NHibernateSessionStateLess.Query<T>();
            }
        }

        public bool isStateLess
        {
            get
            {
                return NHibernateSessionManager.Instance.IsStateLess;
            }
            set
            {
                NHibernateSessionManager.Instance.IsStateLess = value;
            }
        }

        //paging        
        private int _fromIndex = -1;
        private int _MaxResult = 0;
        public void SetFetchPage(int from, int maxResult)
        {
            _fromIndex = from;
            _MaxResult = maxResult;
        }
        public void ResetFetchPage()
        {
            _fromIndex = -1;
            _MaxResult = 0;
        }
    }
}
