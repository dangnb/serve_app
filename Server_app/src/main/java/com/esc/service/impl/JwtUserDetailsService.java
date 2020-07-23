/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.service.impl;

import com.esc.AppContext;
import com.esc.BO.AccountBO;
import com.esc.DAO.AccountDAO;
import java.util.ArrayList;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    private AccountBO account;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        getAccount(username);
        if (this.account != null) {
            if (this.account.getUserName().equals(username)) {
                return new User(this.account.getUserName(), this.account.getPassword(),
                        new ArrayList<>());
            } else {
                throw new UsernameNotFoundException("User not found with username: " + username);
            }
        } else {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }

    public void getAccount(String username) {
        AccountDAO accountDao = AppContext.getBean(AccountDAO.class);
        this.account = accountDao.GetAccountByUserName(username);
    }

    public UserDetails loadUserByUsernameInDB(String username, AccountBO acc) throws UsernameNotFoundException {
        if (acc.getUserName().equals(username)) {
            return new User(acc.getUserName(), acc.getPassword(),
                    new ArrayList<>());
        } else {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }
}
