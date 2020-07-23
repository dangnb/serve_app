/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.service.impl;

import com.esc.BO.AccountBO;
import com.esc.DAO.AccountDAO;
import com.esc.Utils.Password;
import com.esc.model.InputSearch;
import java.util.List;
import org.springframework.stereotype.Service;
import com.esc.service.AccountService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author nguye
 */
@Service
public class AccountServiceImpl implements AccountService {

    public static final Logger logger = LogManager.getLogger(AccountServiceImpl.class);
    @Autowired
    private AccountDAO accountDAO;

    @Override
    public List<AccountBO> getListAccountBO(InputSearch input) {
        return accountDAO.getListAccountBO(input);
    }

    @Override
    public AccountBO GetByUserName(String userName) {
        return accountDAO.GetAccountByUserName(userName);
    }

    @Override
    public int Create(AccountBO acc) {
        try {
            acc.setPassword(Password.hashPassword(acc.getPassword()));
            acc.setConfirmPassword(Password.hashPassword(acc.getConfirmPassword()));
            accountDAO.create(acc);
            return 1;
        } catch (Exception e) {
            logger.error(e);
            return 0;
        }
    }

    @Override
    public int Update(AccountBO acc) {
        try {
            AccountBO account = accountDAO.GetByKey(acc.getId());
            if (!account.getPassword().equals(account.getPassword())) {
                acc.setPassword(Password.hashPassword(acc.getPassword()));
                acc.setConfirmPassword(Password.hashPassword(acc.getConfirmPassword()));
            }
            accountDAO.update(acc);
            return 1;
        } catch (Exception e) {
            logger.error(e);
            return 0;
        }
    }

    @Override
    public int Delete(int id) {
        try {
            AccountBO acc = accountDAO.GetByKey(id);
            accountDAO.delete(acc);
            return 1;
        } catch (Exception e) {
            logger.error(e);
            return 0;
        }
    }

    @Override
    public int getTotal(InputSearch input) {
        return accountDAO.getTotal(input);
    }

    @Override
    public AccountBO getByKey(int id) {
        return accountDAO.GetByKey(id);
    }

}
