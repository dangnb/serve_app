/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.restfull;

import com.esc.model.InputSearch;
import com.esc.model.OutputResult;
import static com.esc.restfull.ProductController.logger;
import com.esc.service.RoleService;
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
@RequestMapping("/role")
public class RoleController {
    
    public static final Logger logger = LogManager.getLogger(RoleController.class);
    
    @Autowired
    public RoleService roleService;
    
    @RequestMapping(value = "/getRoles", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> getAllSupplier(@RequestBody InputSearch input) {
        OutputResult result = new OutputResult();
        try {
            result.setListItems(roleService.GetList(input));
            result.setTotal(roleService.Total(input));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }
}
