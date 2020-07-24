/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.restfull;

import com.esc.AppContext;
import com.esc.BO.AccountBO;
import com.esc.DAO.AccountDAO;
import com.esc.Utils.JwtTokenUtil;
import com.esc.Utils.StringUtils;
import com.esc.model.ErrorMesage;
import com.esc.model.JwtRequest;
import com.esc.model.JwtResponse;
import com.esc.model.OutputResult;
import com.esc.service.impl.JwtUserDetailsService;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class JwtAuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private JwtUserDetailsService userDetailsService;

    @RequestMapping(value = "/authenticate", method = RequestMethod.POST, produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {
        OutputResult result = new OutputResult();
        AccountDAO accountDao = AppContext.getBean(AccountDAO.class);
        AccountBO account = accountDao.GetAccountByUserName(authenticationRequest.getUsername());
        if(StringUtils.isNullOrEmpty(account)){
            ErrorMesage err= new ErrorMesage();
            err.setErrorCode("Authennicate");
            err.setDescription("Login faile");
            result.setErr(err);
            return ResponseEntity.ok(result);
        }
        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        final UserDetails userDetails = userDetailsService
                .loadUserByUsernameInDB(authenticationRequest.getUsername(),account);
        final String token = jwtTokenUtil.generateToken(userDetails);
        result.setJwrRes(new JwtResponse(token, account));
        return ResponseEntity.ok(result);
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}
