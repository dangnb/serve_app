/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.restfull;

import com.esc.BO.CategoryProductBO;
import com.esc.model.ErrorMesage;
import com.esc.model.InputSearch;
import com.esc.model.OutputResult;
import static com.esc.restfull.SupplierController.logger;
import com.esc.service.CategoryProductService;
import java.util.ArrayList;
import java.util.List;
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
@RequestMapping("/CategoryProduct")
public class CategoryProductController {

    public static final Logger logger = LogManager.getLogger(CategoryProductController.class);

    @Autowired
    private CategoryProductService categoryProductService;

    @RequestMapping(value = "/getListAll", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> getAllSupplier(@RequestBody InputSearch input) {
        OutputResult result = new OutputResult();
        try {
            result.setListItems(categoryProductService.getListAll(input));
            result.setTotal(categoryProductService.getTotal(input));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }

    @RequestMapping(value = "/getById", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> getById(@RequestBody int Id) {
        OutputResult result = new OutputResult();
        try {
            List<CategoryProductBO> listCategoryProductBO = new ArrayList<CategoryProductBO>();
            listCategoryProductBO.add(categoryProductService.getById(Id));
            result.setListItems(listCategoryProductBO);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }

    @RequestMapping(value = "/create", method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> Create(@RequestBody CategoryProductBO supp) {
        OutputResult result = new OutputResult();
        try {
            if (categoryProductService.Delete(supp) == 1) {
                return ResponseEntity.ok(result);
            } else {
                ErrorMesage err = new ErrorMesage();
                err.setErrorCode("ERR");
                err.setDescription("Tạo danh mục sản phẩm thất bại");
                result.setErr(err);
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            logger.error(e);
            ErrorMesage err = new ErrorMesage();
            err.setErrorCode("ERR");
            err.setDescription(e.getMessage());
            result.setErr(err);
            return ResponseEntity.ok(result);
        }
    }

    @RequestMapping(value = "/delete", method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> delete(@RequestBody CategoryProductBO supp) {
        OutputResult result = new OutputResult();
        try {
            supp.setStatus(false);
            if (categoryProductService.Delete(supp) == 1) {
                return ResponseEntity.ok(result);
            } else {
                ErrorMesage err = new ErrorMesage();
                err.setErrorCode("ERR");
                err.setDescription("Xóa danh mục sản phẩm thất bại");
                result.setErr(err);
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            logger.error(e);
            ErrorMesage err = new ErrorMesage();
            err.setErrorCode("ERR");
            err.setDescription(e.getMessage());
            result.setErr(err);
            return ResponseEntity.ok(result);
        }
    }

    @RequestMapping(value = "/update", method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    @ResponseBody
    public ResponseEntity<?> update(@RequestBody CategoryProductBO supp) {
        OutputResult result = new OutputResult();
        try {
            if (categoryProductService.Update(supp) == 1) {
                return ResponseEntity.ok("ok");
            } else {
                ErrorMesage err = new ErrorMesage();
                err.setErrorCode("ERR");
                err.setDescription("Cập nhật danh mục sản phẩm thất bại");
                result.setErr(err);
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }
}
