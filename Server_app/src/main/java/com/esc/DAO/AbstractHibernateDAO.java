package com.esc.DAO;

import java.io.Serializable;
import javax.transaction.Transactional;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class AbstractHibernateDAO<T extends Serializable> {

    @Autowired
    SessionFactory sessionFactory;

    @Transactional
    public T create(T entity) {
        getCurrentSession().saveOrUpdate(entity);
        return entity;
    }

    @Transactional
    public T update(T entity) {
        return (T) getCurrentSession().merge(entity);
    }

    @Transactional
    public void delete(T entity) {
        getCurrentSession().delete(entity);
    }

    protected Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }
}
