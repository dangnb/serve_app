/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.service;

import com.esc.BO.CategoryProductBO;
import com.esc.model.InputSearch;
import java.util.List;

/**
 *
 * @author nguye
 */
public interface CategoryProductService {

    List<CategoryProductBO> getListAll(InputSearch input);

    int getTotal(InputSearch input);

    CategoryProductBO getById(int id);

    int Create(CategoryProductBO cP);

    int Update(CategoryProductBO cP);

    int Delete(int id);
}
