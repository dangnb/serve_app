/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.service.impl;

import com.esc.BO.ProductBO;
import com.esc.DAO.ProductDAO;
import com.esc.model.InputSearch;
import com.esc.service.ProductService;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author dangnb
 */
@Service
public class ProductServiceImpl implements ProductService{
    public static final Logger logger = LogManager.getLogger(ProductServiceImpl.class);
    
    @Autowired
    public ProductDAO productDao;

    @Override
    public List<ProductBO> getAllProducts(InputSearch input) {
        return productDao.GetProducts(input);
    }

    @Override
    public int getTotal(InputSearch input) {
        return productDao.GetTotal(input);
    }

    @Override
    public ProductBO GetByKey(int id) {
        return productDao.GetByKey(id);
    }

    @Override
    public void Create(ProductBO pro) {
        try {
            productDao.create(pro);
        } catch (Exception e) {
            logger.error(e);
        }
    }

    @Override
    public void Update(ProductBO pro) {
        try {
            productDao.update(pro);
        } catch (Exception e) {
            logger.error(e);
        }
    }
    
}
