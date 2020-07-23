package com.esc.service.impl;


import com.esc.BO.SupplierBO;
import com.esc.DAO.SupplierDAO;
import com.esc.model.InputSearch;
import com.esc.service.SupplierService;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author nguye
 */
@Service
public class SupplierServiceImpl implements SupplierService{
    
    public static final Logger logger = LogManager.getLogger(SupplierServiceImpl.class);
    @Autowired
    private SupplierDAO supplierDAO;

    @Override
    public List<SupplierBO> getListSupplierBO(InputSearch input) {
        return supplierDAO.getListSupplierBO(input);
    }
    
    @Override
    public int getTotal(InputSearch input) {
        return supplierDAO.getTotal(input);
    }

    @Override
    public SupplierBO GetByUserName(String name) {
       return supplierDAO.GetSupplierBOByUserName(name);
    }

    @Override
    public void Create(SupplierBO supp) {
        supplierDAO.create(supp);
    }

    @Override
    public void Update(SupplierBO supp) {
         supplierDAO.update(supp);
    }

    
    
}
