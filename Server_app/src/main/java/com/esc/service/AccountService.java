/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.service;

import com.esc.BO.AccountBO;
import com.esc.model.InputSearch;
import java.util.List;

/**
 *
 * @author nguye
 */
public interface AccountService {
    List<AccountBO> getListAccountBO(InputSearch input);
    int getTotal(InputSearch input);
    AccountBO GetByUserName(String userName);
    AccountBO getByKey(int id);
    int Create(AccountBO acc);
    int Update(AccountBO acc);
    int Delete(int id);
}
