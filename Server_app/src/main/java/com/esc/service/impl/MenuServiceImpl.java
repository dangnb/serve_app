/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.service.impl;

import com.esc.BO.MenuBO;
import com.esc.DAO.MenuDAO;
import com.esc.service.MenuService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 *
 * @author nguye
 */
@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    public MenuDAO menuDAO;

    @Override
    @Cacheable("MenuBO")
    public List<MenuBO> GetList(String userName) {
        return menuDAO.GetList(userName);
    }

    @Override
    public List<MenuBO> GetAll() {
        return menuDAO.GetAll();
    }
}
