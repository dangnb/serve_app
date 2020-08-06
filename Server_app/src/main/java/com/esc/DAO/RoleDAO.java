/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.DAO;

import com.esc.BO.RoleBO;
import com.esc.Utils.StringUtils;
import com.esc.model.InputSearch;
import java.util.List;
import javax.transaction.Transactional;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author nguye
 */
@Repository
@Transactional
public class RoleDAO extends AbstractHibernateDAO<RoleBO> {

    public List<RoleBO> GetList(InputSearch input) {
        StringBuilder string = new StringBuilder();
        string.append("from RoleBO ");
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            string.append("where name=:name");
        }
        Query query = getCurrentSession().createQuery(string.toString());
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            query.setParameter("name", input.getName());
        }
        query.setFirstResult(input.getPosition());
        query.setMaxResults(input.getPageSize());
        return query.list();
    }

    public int Total(InputSearch input) {
        StringBuilder string = new StringBuilder();
        string.append("from RoleBO ");
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            string.append("where name=:name");
        }
        Query query = getCurrentSession().createQuery(string.toString());
        if (!StringUtils.isNullOrEmpty(input.getName())) {
            query.setParameter("name", input.getName());
        }
        return query.list().size();
    }

    public RoleBO GetByKy(int id) {
        StringBuilder string = new StringBuilder();
        string.append("from RoleBO where roleId =:id");
        Query query = getCurrentSession().createQuery(string.toString());
        query.setParameter("id", id);
        return (RoleBO) query.list().get(0);
    }
}
