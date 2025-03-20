package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Zone;
import com.example.demo.Entity.Brand;

import java.util.List;
import java.util.Optional;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findByIsActiveTrue();
    List<Zone> findByBrandAndIsActiveTrue(Brand brand);

    // Fixed: Changed from findByBrand_ChainIdAndIsActiveTrue to findByBrand_ChainChainIdAndIsActiveTrue
    List<Zone> findByBrand_ChainChainIdAndIsActiveTrue(Long chainId);

    // Fixed: Changed from findByBrand_Chain_GroupIdAndIsActiveTrue to findByBrand_Chain_GroupGroupIdAndIsActiveTrue
    List<Zone> findByBrand_Chain_GroupGroupIdAndIsActiveTrue(Long groupId);

    Optional<Zone> findByZoneNameAndBrandAndIsActiveTrue(String zoneName, Brand brand);
    boolean existsByZoneNameAndBrandAndIsActiveTrue(String zoneName, Brand brand);
    long countByIsActiveTrue();
}