package com.customchef.backend.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.util.StringUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtGenerator tokenGenerator;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(JwtGenerator tokenGenerator,
                                   CustomUserDetailsService customUserDetailsService) {
        this.tokenGenerator = tokenGenerator;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = getJWTFromRequest(request);

        System.out.println(">>> JWT Filter triggered for: " + request.getRequestURI());
        System.out.println(">>> Token present: " + (token != null));

        if(StringUtils.hasText(token)) {
            try {
                boolean valid = tokenGenerator.validateToken(token);
                System.out.println(">>> Token valid: " + valid);

                if(valid) {
                    String username = tokenGenerator.getUsernameFromJWT(token);
                    System.out.println(">>> Username from token: " + username);

                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                    System.out.println(">>> Authorities: " + userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null,
                                    userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            } catch (Exception e) {
                System.out.println(">>> Token validation error: " + e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }

    private String getJWTFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7, bearerToken.length());
        }
        return null;
    }
}
