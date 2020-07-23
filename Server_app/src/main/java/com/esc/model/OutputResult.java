/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.model;

import java.util.List;

/**
 *
 * @author nguye
 */
public class OutputResult {

    private int total;
    List<?> listItems;
    private ErrorMesage err;
    private JwtResponse jwrRes;

    public JwtResponse getJwrRes() {
        return jwrRes;
    }

    public void setJwrRes(JwtResponse jwrRes) {
        this.jwrRes = jwrRes;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public List<?> getListItems() {
        return listItems;
    }

    public void setListItems(List<?> listItems) {
        this.listItems = listItems;
    }

    public ErrorMesage getErr() {
        return err;
    }

    public void setErr(ErrorMesage err) {
        this.err = err;
    }

}
