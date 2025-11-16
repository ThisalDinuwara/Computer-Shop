package com.digitalworld.ecommerce.web.service.impl;

import com.digitalworld.ecommerce.web.config.JwtProvider;
import com.digitalworld.ecommerce.web.domain.USER_ROLE;
import com.digitalworld.ecommerce.web.modal.Cart;
import com.digitalworld.ecommerce.web.modal.Seller;
import com.digitalworld.ecommerce.web.modal.User;
import com.digitalworld.ecommerce.web.modal.VerificationCode;
import com.digitalworld.ecommerce.web.repository.CartRepository;
import com.digitalworld.ecommerce.web.repository.SellerRepository;
import com.digitalworld.ecommerce.web.repository.UserRepository;
import com.digitalworld.ecommerce.web.repository.VerificationCodeRepository;
import com.digitalworld.ecommerce.web.request.LoginRequest;
import com.digitalworld.ecommerce.web.response.AuthResponse;
import com.digitalworld.ecommerce.web.response.SignupRequest;
import com.digitalworld.ecommerce.web.service.AuthService;
import com.digitalworld.ecommerce.web.service.EmailService;
import com.digitalworld.ecommerce.web.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final JwtProvider jwtProvider;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final CustomUserServiceImpl customUserService;
    private final SellerRepository sellerRepository;

    private static final String SIGNING_PREFIX = "signing_";

    @Override
    public void sentLoginOtp(String email, USER_ROLE role) throws Exception {
        String originalEmail = email;

        // Set default role if null
        if (role == null) {
            role = USER_ROLE.ROLE_CUSTOMER;
        }

        // Strip signing prefix if present
        if (email.startsWith(SIGNING_PREFIX)) {
            email = email.substring(SIGNING_PREFIX.length());

            // Only check if seller exists for seller role
            // For customers, allow both new and existing users
            if (USER_ROLE.ROLE_SELLER.equals(role)) {
                Seller seller = sellerRepository.findByEmail(email);
                if (seller == null) {
                    throw new Exception("seller not found");
                }
            }
            // Removed the user existence check to allow new user signups
        }

        // Delete existing verification code if present
        VerificationCode isExist = verificationCodeRepository.findByEmail(email);
        if (isExist != null) {
            verificationCodeRepository.delete(isExist);
        }

        // Generate and save new OTP
        String otp = OtpUtil.generateOtp();

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOtp(otp);
        verificationCode.setEmail(email);
        verificationCodeRepository.save(verificationCode);

        // Send OTP email
        String subject = "Digital World Login/Signup OTP";
        String text = "Your login/signup OTP is - " + otp;

        emailService.sendVerificationOtpEmail(email, otp, subject, text);
        log.info("OTP sent successfully to: {}", email);
    }

    @Override
    public String createUser(SignupRequest req) throws Exception {
        VerificationCode verificationCode = verificationCodeRepository.findByEmail(req.getEmail());

        if (verificationCode == null || !verificationCode.getOtp().trim().equals(req.getOtp().trim())) {
            throw new Exception("wrong otp...");
        }

        User user = userRepository.findByEmail(req.getEmail());

        if (user == null) {
            User createdUser = new User();
            createdUser.setEmail(req.getEmail());
            createdUser.setFullName(req.getFullName());
            createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
            createdUser.setMobile("0712233445");
            createdUser.setPassword(passwordEncoder.encode(req.getOtp()));

            user = userRepository.save(createdUser);

            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(USER_ROLE.ROLE_CUSTOMER.toString()));

        Authentication authentication = new UsernamePasswordAuthenticationToken(req.getEmail(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return jwtProvider.generateToken(authentication);
    }

    @Override
    public AuthResponse signing(LoginRequest req) throws Exception {
        String username = req.getEmail();
        String otp = req.getOtp();

        Authentication authentication = authenticate(username, otp);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Login Successfully!");

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roleName = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();

        authResponse.setRole(USER_ROLE.valueOf(roleName));
        return authResponse;
    }

    private Authentication authenticate(String username, String otp) throws Exception {
        String originalUsername = username;
        boolean isSeller = false;

        // Strip signing prefix if present and detect if it's a seller
        if (username.startsWith(SIGNING_PREFIX)) {
            username = username.substring(SIGNING_PREFIX.length());
            isSeller = true;
        }

        log.info("Authentication attempt - Original: {}, Stripped: {}, IsSeller: {}",
                originalUsername, username, isSeller);

        // Verify OTP first
        VerificationCode verificationCode = verificationCodeRepository.findByEmail(username);

        if (verificationCode != null) {
            log.debug("Stored OTP: {}, Provided OTP: {}", verificationCode.getOtp(), otp);
        } else {
            log.error("No verification code found for email: {}", username);
            throw new BadCredentialsException("wrong otp");
        }

        // Validate OTP
        if (!verificationCode.getOtp().trim().equals(otp.trim())) {
            log.error("OTP mismatch");
            throw new BadCredentialsException("wrong otp");
        }

        // Load user details based on role
        UserDetails userDetails;
        List<GrantedAuthority> authorities = new ArrayList<>();

        if (isSeller) {
            Seller seller = sellerRepository.findByEmail(username);
            if (seller == null) {
                log.error("Seller not found: {}", username);
                throw new BadCredentialsException("Seller not found");
            }

            log.info("Seller found: {}", seller.getEmail());
            authorities.add(new SimpleGrantedAuthority(USER_ROLE.ROLE_SELLER.toString()));

            userDetails = new org.springframework.security.core.userdetails.User(
                    seller.getEmail(),
                    seller.getPassword() != null ? seller.getPassword() : "",
                    authorities
            );
        } else {
            // Check if user exists, if not create them (auto-signup on first login)
            User user = userRepository.findByEmail(username);
            if (user == null) {
                log.info("Creating new user for: {}", username);
                User newUser = new User();
                newUser.setEmail(username);
                newUser.setFullName(username.split("@")[0]); // Use email prefix as name
                newUser.setRole(USER_ROLE.ROLE_CUSTOMER);
                newUser.setMobile("0000000000");
                newUser.setPassword(passwordEncoder.encode(otp));
                user = userRepository.save(newUser);

                // Create cart for new user
                Cart cart = new Cart();
                cart.setUser(user);
                cartRepository.save(cart);
            }

            userDetails = customUserService.loadUserByUsername(username);
            if (userDetails == null) {
                log.error("User not found: {}", username);
                throw new BadCredentialsException("invalid username");
            }
        }

        log.info("Authentication successful for: {}", username);

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
    }
}