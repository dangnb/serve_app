/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.model;

import com.esc.BO.AccountBO;
import java.io.Serializable;

public class JwtResponse implements Serializable {

    private static final long serialVersionUID = -8091879091924046844L;
    private final String jwttoken;
    private AccountBO user;

    public AccountBO getUser() {
        return user;
    }

    public void setUser(AccountBO user) {
        this.user = user;
    }

    public JwtResponse(String jwttoken, AccountBO acc) {
        this.jwttoken = jwttoken;
        this.user = acc;
    }

    public String getToken() {
        return this.jwttoken;
    }
}
