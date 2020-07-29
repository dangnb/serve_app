/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.DAO;

import com.esc.BO.ProductBO;
import com.esc.Utils.DateTimeUtils;
import com.esc.Utils.StringUtils;
import com.esc.model.InputSearch;
import java.util.Date;
import java.util.List;
import org.hibernate.query.Query;
import javax.transaction.Transactional;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

/**
 *
 * @author dangnb
 */
@Repository
@Transactional
public class ProductDAO extends AbstractHibernateDAO<ProductBO> {

    public List<ProductBO> GetProducts(InputSearch input) {
        StringBuilder string = new StringBuilder();
        string.append("from ProductBO where status = 1 ");
        if (!StringUtils.isNullOrEmpty(input.getCode())) {
            string.append("and productCode= :code ");
        }
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            string.append("and productName= :name ");
        }
        if (!StringUtils.isNullOrEmpty(input.getToDate())) {
            string.append("and createdDate< :toDate ");
        }
        if (!StringUtils.isNullOrEmpty(input.getFromDate())) {
            string.append("and createdDate> :fromDate ");
        }
        string.append("order by createdDate desc ");
        Query query = getCurrentSession().createQuery(string.toString());
        if (!StringUtils.isNullOrEmpty(input.getCode())) {
            query.setParameter("code", input.getCode());
        }
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            query.setParameter("name", input.getName());
        }
        if (!StringUtils.isNullOrEmpty(input.getToDate())) {
            Date toDate = DateTimeUtils.convertToEndDate1(input.getFromDate());
            query.setParameter("toDate", toDate);
        }
        if (!StringUtils.isNullOrEmpty(input.getFromDate())) {
            Date fDate = DateTimeUtils.convertToStartDate1(input.getFromDate());
            query.setParameter("fromDate", fDate);
        }
        query.setFirstResult(input.getPosition());
        query.setMaxResults(input.getPageSize());
        return query.list();
    }

    public int GetTotal(InputSearch input) {
        StringBuilder string = new StringBuilder();
        string.append("from ProductBO where status = 1 ");
        if (!StringUtils.isNullOrEmpty(input.getCode())) {
            string.append("and productCode= :code ");
        }
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            string.append("and productName= :name ");
        }
        if (!StringUtils.isNullOrEmpty(input.getToDate())) {
            string.append("and createdDate< :toDate ");
        }
        if (!StringUtils.isNullOrEmpty(input.getFromDate())) {
            string.append("and createdDate> :fromDate ");
        }
        string.append("order by createdDate desc ");
        Query query = getCurrentSession().createQuery(string.toString());
        if (!StringUtils.isNullOrEmpty(input.getCode())) {
            query.setParameter("code", input.getCode());
        }
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            query.setParameter("name", input.getName());
        }
        if (!StringUtils.isNullOrEmpty(input.getToDate())) {
            Date toDate = DateTimeUtils.convertToEndDate1(input.getFromDate());
            query.setParameter("toDate", toDate);
        }
        if (!StringUtils.isNullOrEmpty(input.getFromDate())) {
            Date fDate = DateTimeUtils.convertToStartDate1(input.getFromDate());
            query.setParameter("fromDate", fDate);
        }
        return query.list().size();
    }
    
    public ProductBO GetByKey(int id){
        Criteria criteria = getCurrentSession().createCriteria(ProductBO.class);
        criteria.add(Restrictions.eq("supplierId", id));
        return (ProductBO) criteria.list().get(0);
    }
}
