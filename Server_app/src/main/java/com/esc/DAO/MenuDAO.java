/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.DAO;

import com.esc.BO.MenuBO;
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
public class MenuDAO extends AbstractHibernateDAO<MenuBO> implements java.io.Serializable {

    public List<MenuBO> GetList(String userName) {
        StringBuilder string = new StringBuilder();
        string.append("select mu from MenuBO mu where mu.id in "
                + "(select menuId as id from  PermissionBO where roleId in "
                + "(select roleId as roleId from RoleBO where roleId in ("
                + "select roleId as roleId from UserRoleBO where userId in ("
                + "select id as roleId from  AccountBO where userName= :userName))))");
        Query query = getCurrentSession().createQuery(string.toString());
        query.setParameter("userName", userName);
        List<MenuBO> list = query.list();
        return list;
    }
}
