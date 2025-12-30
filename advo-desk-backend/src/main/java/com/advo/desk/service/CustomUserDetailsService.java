package com.advo.desk.service;

import com.advo.desk.entity.Admin;
import com.advo.desk.entity.Advocate;
import com.advo.desk.repository.AdminRepository;
import com.advo.desk.repository.AdvocateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * Custom UserDetailsService that checks admin and advocate tables
 * Only supports ADMIN and ADVOCATE roles
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdvocateRepository advocateRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try Admin
        var adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return User.builder()
                    .username(admin.getUsername())
                    .password(admin.getPassword())
                    .authorities(new ArrayList<>())
                    .build();
        }

        // Try Advocate
        var advocateOpt = advocateRepository.findByUsername(username);
        if (advocateOpt.isPresent()) {
            Advocate advocate = advocateOpt.get();
            return User.builder()
                    .username(advocate.getUsername())
                    .password(advocate.getPassword())
                    .authorities(new ArrayList<>())
                    .build();
        }

        throw new UsernameNotFoundException("User not found: " + username);
    }
}
