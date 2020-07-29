/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.BO;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 *
 * @author nguye
 */
@Entity
@Table(name="Product")
public class ProductBO   implements java.io.Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", nullable = true)
    private int id;
    
    @Column(name = "PRODUCTNAME", nullable = true)
    private String productName;
    
    @Column(name = "PRODUCTCODE", nullable = true)
    private String productCode;
    
    @Column(name = "FILEPATH", nullable = true)
    private String filePath;
    
    @Column(name = "SUPPLIERID", nullable = true)
    private int supplierId;
    
    @Column(name = "CATEGORYPRODUCTID", nullable = true)
    private String categoryProductId;
    
    @Column(name = "STATUS", nullable = true)
    private boolean status;
    
    @Column(name = "VAT", nullable = true)
    private int vat;
            
    @Column(name = "CREATEDDATE", nullable = true)
    private Date createdDate;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public int getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(int supplierId) {
        this.supplierId = supplierId;
    }

    public String getCategoryProductId() {
        return categoryProductId;
    }

    public void setCategoryProductId(String categoryProductId) {
        this.categoryProductId = categoryProductId;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public int getVat() {
        return vat;
    }

    public void setVat(int vat) {
        this.vat = vat;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }
    
    
}
