/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.service;

import com.esc.BO.MenuBO;
import java.util.List;

/**
 *
 * @author nguye
 */
public interface MenuService {
    List<MenuBO> GetList(String userName);
    List<MenuBO> GetAll();
}
