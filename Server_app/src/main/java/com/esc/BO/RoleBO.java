/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.BO;

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
@Table(name = "Role")
public class RoleBO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RELOID", nullable = true)
    private int roleId;
    
    @Column(name = "NAME", nullable = true)
    private String name;
    
    @Column(name = "TITLE", nullable = true)
    private String title;
    
    @Column(name = "GROUPID", nullable = true)
    private int groupId;
    
    @Column(name = "ISADMIN", nullable = true)
    private String isAdmin;
}
