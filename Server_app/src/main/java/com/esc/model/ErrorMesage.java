/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.model;

/**
 *
 * @author nguye
 */
public class ErrorMesage {
    private String errorCode;
    private String description;

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String ErrorCode) {
        this.errorCode = ErrorCode;
    }

    public String getDepcription() {
        return description;
    }

    public void setDepcription(String Depcription) {
        this.description = Depcription;
    }
}
