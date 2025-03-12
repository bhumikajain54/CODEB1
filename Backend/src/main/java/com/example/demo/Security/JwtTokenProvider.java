package com.example.demo.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {
    
    private static final String SECRET_KEY = "ThisIsAReallyLongSecretKeyThatIsAtLeast32Characters"; // ✅ Secure Key
    private final long expirationTime = 86400000; // 1 day (in milliseconds)

    // Generate JWT Token
    public String generateToken(Authentication authentication) {
        return Jwts.builder()
                .setSubject(authentication.getName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey()) // Uses a secure key
                .compact();
    }

    // Extract username from token
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Validate JWT Token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.err.println("Token expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("Unsupported JWT: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.err.println("Malformed JWT: " + e.getMessage());
        } catch (SignatureException e) {
            System.err.println("Invalid signature: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("Illegal argument token: " + e.getMessage());
        }
        return false;
    }

    // Generate a Secure Signing Key
    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getEncoder().encode(SECRET_KEY.getBytes()); // Ensures correct length
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
