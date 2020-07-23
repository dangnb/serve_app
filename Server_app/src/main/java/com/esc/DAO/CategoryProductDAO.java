/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.DAO;

import com.esc.BO.CategoryProductBO;
import com.esc.Utils.DateTimeUtils;
import com.esc.Utils.StringUtils;
import com.esc.model.InputSearch;
import java.util.Date;
import java.util.List;
import javax.persistence.TemporalType;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author nguye
 */
@Repository
@Transactional
public class CategoryProductDAO extends AbstractHibernateDAO<CategoryProductBO> {

    public List<CategoryProductBO> GetAllList(InputSearch input) {

        StringBuilder string = new StringBuilder();
        string.append("from CategoryProductBO ");
        string.append("where status = 1 ");
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            string.append("and name = :name ");
        }
        if (!StringUtils.isNullOrEmpty(input.getCode())) {
            string.append("and code = :code ");
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
        if (!StringUtils.isNullOrEmpty(input.getCode())) {
            query.setParameter("code", input.getCode());
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

    public int GetTotal(InputSearch input) {
        StringBuilder string = new StringBuilder();
        string.append("from CategoryProductBO ");
        string.append("where status = 1 ");
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            string.append("and name = :name ");
        }
        if (!StringUtils.isNullOrEmpty(input.getCode())) {
            string.append("and code = :code ");
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
        if (!StringUtils.isNullOrEmpty(input.getCode())) {
            query.setParameter("code", input.getCode());
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

    public CategoryProductBO GetById(int ID) {
        return (CategoryProductBO) getCurrentSession()
                .createQuery("from CategoryProductBO where Id=:id")
                .setParameter("id", ID).list().get(0);
    }
}
