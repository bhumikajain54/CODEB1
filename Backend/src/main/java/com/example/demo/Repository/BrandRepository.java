package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Brand;
import com.example.demo.Entity.Chain;
import com.example.demo.Entity.Group;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    List<Brand> findByIsActiveTrue();
    List<Brand> findByChainAndIsActiveTrue(Chain chain);
    List<Brand> findByChain_GroupAndIsActiveTrue(Group group);
    Optional<Brand> findByBrandNameAndChainAndIsActiveTrue(String brandName, Chain chain);
    boolean existsByChain(Chain chain);
    boolean existsByBrandId(Long brandId);

    // Count active brands
    long countByIsActiveTrue();

    // Check if brand is linked to any zone
    boolean existsByBrandIdAndIsActiveTrue(Long brandId);
}