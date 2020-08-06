/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.service;

import com.esc.BO.RoleBO;
import com.esc.model.InputSearch;
import java.util.List;

/**
 *
 * @author nguye
 */
public interface RoleService {
    List<RoleBO> GetList(InputSearch input);
    int Total(InputSearch input);
    int Create(RoleBO role);
    int Update(RoleBO role);
    int Delete(RoleBO role);
    RoleBO GetByKey(int id);
}
