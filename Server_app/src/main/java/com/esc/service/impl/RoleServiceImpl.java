/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.service.impl;

import com.esc.BO.RoleBO;
import com.esc.DAO.RoleDAO;
import com.esc.model.InputSearch;
import com.esc.service.RoleService;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author nguye
 */
@Service
public class RoleServiceImpl implements RoleService{
    public static final Logger logger = LogManager.getLogger(RoleServiceImpl.class);
    
    @Autowired
    public RoleDAO roleDAO;

    @Override
    public List<RoleBO> GetList(InputSearch input) {
        try {
            return roleDAO.GetList(input);
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }

    @Override
    public int Total(InputSearch input) {
        try {
            return roleDAO.Total(input);
        } catch (Exception e) {
            logger.error(e);
            return 0;
        }
    }

    @Override
    public int Create(RoleBO role) {
       try {
            roleDAO.create(role);
            return 1;
        } catch (Exception e) {
            logger.error(e);
            return 0;
        }
    }

    @Override
    public int Update(RoleBO role) {
        try {
            roleDAO.update(role);
            return 1;
        } catch (Exception e) {
            logger.error(e);
            return 0;
        }
    }

    @Override
    public int Delete(RoleBO role) {
        return 1;
    }

    @Override
    public RoleBO GetByKey(int id) {
        try {
            return roleDAO.GetByKy(id);
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }
    
}
