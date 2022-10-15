using NHibernate;
using NHibernate.Criterion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace SessionManager
{
    public interface IBaseService<T, IdT>
    {
        ICriteria CreateCriteria();

        Task<List<T>?> GetByCriteria(ICriteria _crit);

        Task<List<T>?> GetByCriteria(params ICriterion[] criterion);

        Task<T> CreateNew(T entity);
        Task<T> Delete(T entity);
        Task<T> Delete(IdT key);
        Task<T> Update(T entity);
        Task<T> Save(T entity);
        Task<R> ExecuteScalar<R>(string Query, bool isHQL, params SQLParam[] _params);
        Task<IList<R>> GetbyQuery<R>(string query, bool hql, params SQLParam[] _params);

        Task<T> Getbykey(IdT key);

        Task<List<T>> GetbySQLQuery(string Query, params SQLParam[] _params);
        Task<IList<T>?> GetbyHQuery(string Query, params SQLParam[] _params);
        IList<T> GetbySQLQuery(string Query, int pageIndex, int pageSize, out int total, params SQLParam[] _params);
        List<T> GetbyHQuery(string query, int pageIndex, int pageSize, out int total, params SQLParam[] _params);
        T Get(Expression<Func<T, bool>> predicate);

        object ExcuteNonQuery(string query, bool isHQL, params SQLParam[] _params);
        void CommitChanges();
        void BindSession(object entity);
        void UnbindSession(object entity);
        void UnbindSession();
        void BeginTran();
        void CommitTran();
        void RolbackTran();
        void SetFetchPage(int from, int maxResult);
        void ResetFetchPage();
        IQueryable<T> Query { get; }
        void Clear();
    }
    public class SQLParam
    {
        public string ParameName { get; set; }

        public object ParamValue { get; set; }

        public SQLParam(string mParamName, object mParamValue)
        {
            this.ParameName = mParamName;
            this.ParamValue = mParamValue;
        }
    }
}
