/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.restfull;

import com.esc.BO.ProductBO;
import com.esc.BO.SupplierBO;
import com.esc.model.ErrorMesage;
import com.esc.model.InputSearch;
import com.esc.model.OutputResult;
import static com.esc.restfull.SupplierController.logger;
import com.esc.service.ProductService;
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
@RequestMapping("/product")
public class ProductController {

    public static final Logger logger = LogManager.getLogger(SupplierController.class);

    @Autowired
    private ProductService productService;

    @RequestMapping(value = "/getproducts", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> getAllSupplier(@RequestBody InputSearch input) {
        OutputResult result = new OutputResult();
        try {
            result.setListItems(productService.getAllProducts(input));
            result.setTotal(productService.getTotal(input));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }
    
    @RequestMapping(value = "/create", method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> Create(@RequestBody ProductBO pro) {
        OutputResult result = new OutputResult();
        try {
            productService.Create(pro);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error(e);
            ErrorMesage err = new ErrorMesage();
            err.setErrorCode("ERR");
            err.setDescription(e.getMessage());
            result.setErr(err);
            return ResponseEntity.ok(result);
        }
    }
}
