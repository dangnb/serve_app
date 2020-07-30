/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.DAO;

import com.esc.BO.MenuBO;
import java.util.List;
import javax.transaction.Transactional;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

/**
 *
 * @author nguye
 */
@Repository
@Transactional
public class MenuDAO extends AbstractHibernateDAO<MenuBO> implements java.io.Serializable {

    public List<MenuBO> GetList(String userName) {
        StringBuilder string = new StringBuilder();
        Criteria criteria = getCurrentSession().createCriteria(MenuBO.class);
        criteria.add(Restrictions.eq("status", true));
        return criteria.list();
    }
}
