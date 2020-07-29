/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.service;

import com.esc.BO.SupplierBO;
import com.esc.model.InputSearch;
import java.util.List;

/**
 *
 * @author nguye
 */
public interface SupplierService {

    List<SupplierBO> getListSupplierBO(InputSearch input);

    int getTotal(InputSearch input);

    SupplierBO GetByUserName(String name);

    SupplierBO GetByKey(int id);

    void Create(SupplierBO supp);

    void Update(SupplierBO supp);
}
