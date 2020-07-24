/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.restfull;

import com.esc.BO.SupplierBO;
import com.esc.model.ErrorMesage;
import com.esc.model.InputSearch;
import com.esc.model.OutputResult;
import com.esc.service.SupplierService;
import com.esc.service.impl.AccountServiceImpl;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author nguye
 */
@RestController
@RequestMapping("/Supplier")
public class SupplierController {
    public static final Logger logger = LogManager.getLogger(SupplierController.class);
    
    
    @Autowired
    private SupplierService supplierService;
    
    @RequestMapping(value = "/getAllSupplier", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> getAllSupplier(@RequestBody InputSearch input) {
        OutputResult result= new OutputResult();
        try {
            result.setListItems(supplierService.getListSupplierBO( input));
            result.setTotal(supplierService.getTotal(input));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }
    
    @RequestMapping(value = "/create", method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> Create(@RequestBody SupplierBO supp) {
        OutputResult result= new OutputResult();
        try {
            supplierService.Create(supp);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error(e);
            ErrorMesage err= new ErrorMesage();
            err.setErrorCode("ERR");
            err.setDescription(e.getMessage());
            result.setErr(err);
            return ResponseEntity.ok(result);
        }
    }
    @RequestMapping(value = "/delete", method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> delete(@RequestBody SupplierBO supp) {
        try {
            supp.setStatus(false);
            supplierService.Update(supp);
            return ResponseEntity.ok("ok");
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }
    
     @RequestMapping(value = "/update", method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> update(@RequestBody SupplierBO supp) {
        try {
            supplierService.Update(supp);
            return ResponseEntity.ok("ok");
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }
}
