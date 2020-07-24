/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.restfull;

import com.esc.BO.AccountBO;
import com.esc.model.ErrorMesage;
import com.esc.model.InputSearch;
import com.esc.model.OutputResult;
import com.esc.service.AccountService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author nguye
 */
@RestController
@RequestMapping("/account")
public class AccountController {

    public static final Logger logger = LogManager.getLogger(AccountController.class);

    @Autowired
    private AccountService accountService;

    @RequestMapping(value = "/getallaccount", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> getAllUser(@RequestBody InputSearch input) {
        OutputResult result= new OutputResult();
        try {
            result.setListItems(accountService.getListAccountBO(input));
            result.setTotal(accountService.getTotal(input));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }

    @RequestMapping(value = "/getaccountbyname", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> getAccountByName(@RequestParam("usename") String usename) {
        try {
            return ResponseEntity.ok(accountService.GetByUserName(usename));
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }
    
    @RequestMapping(value = "/getByKey", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> getByKey(@RequestParam("id") int id) {
        try {
            return ResponseEntity.ok(accountService.getByKey(id));
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> create(@RequestBody AccountBO acc) {
        OutputResult result = new OutputResult();
        try {
            if(accountService.GetByUserName(acc.getUserName())!=null){
                 ErrorMesage err = new ErrorMesage();
                err.setErrorCode("Error");
                err.setDescription("Tải khoản đã tồn tại trên hệ thống");
                result.setErr(err);
                return ResponseEntity.ok(result);
            }
            int checkCreate = accountService.Create(acc);
            if (checkCreate == 1) {
                return ResponseEntity.ok(result);
            } else {
                ErrorMesage err = new ErrorMesage();
                err.setErrorCode("Error");
                err.setDescription("Create account false");
                result.setErr(err);
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }
    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> update(@RequestBody AccountBO acc) {
        OutputResult result = new OutputResult();
        try {
            int checkCreate = accountService.Update(acc);
            if (checkCreate == 1) {
                return ResponseEntity.ok(result);
            } else {
                ErrorMesage err = new ErrorMesage();
                err.setErrorCode("Error");
                err.setDescription("Update account false");
                result.setErr(err);
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }
    @RequestMapping(value = "/delete", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> Delete(@RequestParam("id") int id) {
        OutputResult result = new OutputResult();
        try {
            int checkCreate = accountService.Delete(id);
            if (checkCreate == 1) {
                return ResponseEntity.ok(result);
            } else {
                ErrorMesage err = new ErrorMesage();
                err.setErrorCode("Error");
                err.setDescription("Update account false");
                result.setErr(err);
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }
}
