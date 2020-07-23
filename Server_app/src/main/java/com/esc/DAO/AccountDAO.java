/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.DAO;

import com.esc.BO.AccountBO;
import com.esc.Utils.DateTimeUtils;
import com.esc.Utils.StringUtils;
import com.esc.model.InputSearch;
import java.util.Date;
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
public class AccountDAO extends AbstractHibernateDAO<AccountBO> implements java.io.Serializable {

    public List<AccountBO> getListAccountBO(InputSearch input) {
       StringBuilder string = new StringBuilder();
        string.append("from AccountBO ");
        string.append("where status = 1 ");
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            string.append("and userName = :name ");
        }
        if (!StringUtils.isNullOrEmpty(input.getFromDate())) {
            string.append("and createdDate > :fromDate ");
        }
        if (!StringUtils.isNullOrEmpty(input.getToDate())) {
            string.append("and createdDate < :toDate ");
        }

        string.append("order by createdDate desc ");

        Query query = getCurrentSession().createQuery(string.toString());

        if (!StringUtils.isNullOrEmpty(input.getName())) {
            query.setParameter("name", input.getName());
        }
        if (!StringUtils.isNullOrEmpty(input.getFromDate())) {
            Date fDate = DateTimeUtils.convertToStartDate1(input.getFromDate());
            query.setParameter("fromDate", fDate);
        }
        if (!StringUtils.isNullOrEmpty(input.getToDate())) {
            Date tTime = DateTimeUtils.convertToEndDate1(input.getToDate());
            query.setParameter("toDate", tTime);
        }
        query.setFirstResult(input.getPosition());
        query.setMaxResults(input.getPageSize());
        return query.list();
    }
    
     public int getTotal(InputSearch input) {
       StringBuilder string = new StringBuilder();
        string.append("from AccountBO ");
        string.append("where status = 1 ");
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            string.append("and userName = :name ");
        }
        if (!StringUtils.isNullOrEmpty(input.getFromDate())) {
            string.append("and createdDate > :fromDate ");
        }
        if (!StringUtils.isNullOrEmpty(input.getToDate())) {
            string.append("and createdDate < :toDate ");
        }

        string.append("order by createdDate desc ");

        Query query = getCurrentSession().createQuery(string.toString());

        if (!StringUtils.isNullOrEmpty(input.getName())) {
            query.setParameter("name", input.getName());
        }
        if (!StringUtils.isNullOrEmpty(input.getFromDate())) {
            Date fDate = DateTimeUtils.convertToStartDate1(input.getFromDate());
            query.setParameter("fromDate", fDate);
        }
        if (!StringUtils.isNullOrEmpty(input.getToDate())) {
            Date tTime = DateTimeUtils.convertToEndDate1(input.getToDate());
            query.setParameter("toDate", tTime);
        }
        return query.list().size();
    }

    public AccountBO GetAccountByUserName(String userName) {
        Criteria criteria = getCurrentSession().createCriteria(AccountBO.class);
        criteria.add(Restrictions.eq("userName", userName));
        if (criteria.list().size() < 1) {
            return null;
        }
        return (AccountBO) criteria.list().get(0);
    }
    public AccountBO GetByKey(int id) {
        Criteria criteria = getCurrentSession().createCriteria(AccountBO.class);
        criteria.add(Restrictions.eq("id", id));
        if (criteria.list().size() < 1) {
            return null;
        }
        return (AccountBO) criteria.list().get(0);
    }
}
