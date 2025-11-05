package com.digitalworld.ecommerce.web.service.impl;

import com.digitalworld.ecommerce.web.domain.USER_ROLE;
import com.digitalworld.ecommerce.web.modal.Seller;
import com.digitalworld.ecommerce.web.modal.User;
import com.digitalworld.ecommerce.web.repository.SellerReository;
import com.digitalworld.ecommerce.web.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@Service
public class CustomUserServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final SellerReository sellerReository;
    private static final String SELLER_PREFIX = "seller_";

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (username == null || username.isBlank()) {
            throw new UsernameNotFoundException("Username cannot be null or empty");
        }

        log.debug("Attempting to load user with username: {}", username);

        if (username.startsWith(SELLER_PREFIX)) {
            // Seller login
            String actualUsername = username.substring(SELLER_PREFIX.length());
            if (actualUsername.isBlank()) {
                throw new UsernameNotFoundException("Seller username cannot be empty after prefix");
            }

            Seller seller = sellerReository.findByEmail(actualUsername);
            if (seller == null) {
                throw new UsernameNotFoundException("Seller not found with email: " + actualUsername);
            }

            return buildUserDetails(
                    seller.getEmail(),
                    seller.getPassword(),
                    seller.getRole()
            );
        } else {
            // Normal user login
            User user = userRepository.findByEmail(username);
            if (user == null) {
                throw new UsernameNotFoundException("User not found with email: " + username);
            }

            return buildUserDetails(
                    user.getEmail(),
                    user.getPassword(),
                    user.getRole()
            );
        }
    }

    /**
     * Builds Spring Security UserDetails object safely.
     */
    private UserDetails buildUserDetails(String email, String password, USER_ROLE role) {
        // Validation: Spring Security User() will throw if these are invalid
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or empty when building UserDetails");
        }
        if (password == null || password.isBlank()) {
            // if you support OAuth or passwordless sellers, use a dummy password:
            log.warn("Password is null or empty for user: {}", email);
            password = "N/A";
        }

        if (role == null) {
            log.warn("Role is null for user: {}, defaulting to ROLE_CUSTOMER", email);
            role = USER_ROLE.ROLE_CUSTOMER;
        }

        List<GrantedAuthority> authorityList = new ArrayList<>();
        authorityList.add(new SimpleGrantedAuthority(role.toString()));

        log.debug("Building UserDetails for {} with role {}", email, role);

        return new org.springframework.security.core.userdetails.User(
                email,
                password,
                authorityList
        );
    }
}
