/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.service;

import com.esc.BO.ProductBO;
import com.esc.model.InputSearch;
import java.util.List;

/**
 *
 * @author nguye
 */
public interface ProductService {

    List<ProductBO> getAllProducts(InputSearch input);

    int getTotal(InputSearch input);

    ProductBO GetByKey(int id);

    void Create(ProductBO pro);

    void Update(ProductBO pro);
}
