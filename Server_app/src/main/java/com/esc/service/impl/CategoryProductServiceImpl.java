/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.service.impl;

import com.esc.BO.CategoryProductBO;
import com.esc.DAO.CategoryProductDAO;
import com.esc.model.InputSearch;
import com.esc.service.CategoryProductService;
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
public class CategoryProductServiceImpl implements CategoryProductService {

    public static final Logger logger = LogManager.getLogger(CategoryProductServiceImpl.class);

    @Autowired
    public CategoryProductDAO categoryProductDAO;

    @Override
    public List<CategoryProductBO> getListAll(InputSearch input) {
        try {
            return categoryProductDAO.GetAllList(input);
        } catch (Exception e) {
            logger.error(e);
        }
        return null;
    }

    @Override
    public int getTotal(InputSearch input) {
        try {
            return categoryProductDAO.GetTotal(input);
        } catch (Exception e) {
            logger.error(e);
        }
        return 0;
    }

    @Override
    public CategoryProductBO getById(int id) {
        try {
            return categoryProductDAO.GetById(id);
        } catch (Exception e) {
            logger.error(e);
        }
        return null;
    }

    @Override
    public int Create(CategoryProductBO cP) {
        try {
            categoryProductDAO.create(cP);
            return 1;
        } catch (Exception e) {
            logger.error(e);
        }
        return 0;
    }
    @Override
    public int Update(CategoryProductBO cP) {
        try {
            categoryProductDAO.update(cP);
            return 1;
        } catch (Exception e) {
            logger.error(e);
        }
        return 0;
    }

    @Override
    public int Delete(int id) {
        try {
            CategoryProductBO cate=categoryProductDAO.GetById(id);
            categoryProductDAO.delete(cate);
            return 1;
        } catch (Exception e) {
            logger.error(e);
        }
        return 0;
    }

}
