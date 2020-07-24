/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.DAO;

import com.esc.BO.SupplierBO;
import com.esc.Utils.StringUtils;
import com.esc.model.InputSearch;
import java.util.List;
import javax.transaction.Transactional;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author nguye
 */
@Repository
@Transactional
public class SupplierDAO extends AbstractHibernateDAO<SupplierBO> {

    public List<SupplierBO> getListSupplierBO(InputSearch input) {
        StringBuilder string = new StringBuilder();
        string.append("from SupplierBO where status = 1");
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            string.append(" and name =:name ");
        }
        if (!StringUtils.isNullOrEmpty(input.getCode())) {
            string.append(" and code =:code ");
        }
        if (!StringUtils.isNullOrEmpty(input.getToDate())) {
            string.append(" and createdDate <:toDate ");
        }
        if (!StringUtils.isNullOrEmpty(input.getFromDate())) {
            string.append(" and createdDate >:fromDate ");
        }
        string.append(" order by createdDate desc");

        Query query = getCurrentSession()
                .createQuery(string.toString());
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            query.setParameter("name", input.getName());
        }
        if (!StringUtils.isNullOrEmpty(input.getCode())) {
            query.setParameter("code", input.getCode());
        }
        if (!StringUtils.isNullOrEmpty(input.getToDate())) {
            query.setDate("toDate", input.getToDate());
        }
        if (!StringUtils.isNullOrEmpty(input.getFromDate())) {
            query.setDate("fromDate", input.getFromDate());
        }
        query.setFirstResult(input.getPosition());
        query.setMaxResults(input.getPageSize());
        return query.list();
    }

    public int getTotal(InputSearch input) {
        StringBuilder string = new StringBuilder();
        string.append("from SupplierBO where status = 1");
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            string.append(" and name= :name ");
        }
        if (!StringUtils.isNullOrEmpty(input.getCode())) {
            string.append(" and code= :code ");
        }
        if (!StringUtils.isNullOrEmpty(input.getToDate())) {
            string.append(" and createdDate < :toDate ");
        }
        if (!StringUtils.isNullOrEmpty(input.getFromDate())) {
            string.append(" and createdDate > :fromDate ");
        }
        string.append(" order by createdDate desc");

        Query query = getCurrentSession()
                .createQuery(string.toString());
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            query.setParameter("name", input.getName());
        }
        if (!StringUtils.isNullOrEmpty(input.getCode())) {
            query.setParameter("code", input.getCode());
        }
        if (!StringUtils.isNullOrEmpty(input.getToDate())) {
            query.setDate("toDate", input.getToDate());
        }
        if (!StringUtils.isNullOrEmpty(input.getFromDate())) {
            query.setDate("fromDate", input.getFromDate());
        }
        return query.list().size();
    }

    public SupplierBO GetSupplierBOByUserName(String name) {
        Criteria criteria = getCurrentSession().createCriteria(SupplierBO.class);
        criteria.add(Restrictions.eq("Name", name));
        return (SupplierBO) criteria.list().get(0);
    }
     public SupplierBO GetByKey(int id) {
        Criteria criteria = getCurrentSession().createCriteria(SupplierBO.class);
        criteria.add(Restrictions.eq("supplierId", id));
        return (SupplierBO) criteria.list().get(0);
    }
}
