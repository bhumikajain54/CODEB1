package com.example.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Zone;
import com.example.demo.Entity.Brand;
import com.example.demo.Repository.ZoneRepository;
import com.example.demo.Repository.BrandRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ZoneService {

    @Autowired
    private ZoneRepository zoneRepository;

    @Autowired
    private BrandRepository brandRepository;

    // Get all active zones
    public List<Zone> getAllZones() {
        return zoneRepository.findByIsActiveTrue();
    }

    // Get zones by brand id
    public List<Zone> getZonesByBrand(Long brandId) {
        Optional<Brand> brand = brandRepository.findById(brandId);
        if (brand.isPresent()) {
            return zoneRepository.findByBrandAndIsActiveTrue(brand.get());
        }
        throw new RuntimeException("Brand not found");
    }

    // Get zones by chain id - fixed to use chainChainId instead of chainId
    public List<Zone> getZonesByChain(Long chainId) {
        return zoneRepository.findByBrand_ChainChainIdAndIsActiveTrue(chainId);
    }

    // Get zones by group id - fixed to use groupGroupId instead of groupId
    public List<Zone> getZonesByGroup(Long groupId) {
        return zoneRepository.findByBrand_Chain_GroupGroupIdAndIsActiveTrue(groupId);
    }

    // Get zone by id
    public Optional<Zone> getZoneById(Long zoneId) {
        return zoneRepository.findById(zoneId);
    }

    // Add new zone
    public Zone addZone(Zone zone, Long brandId) {
        // Find and set the brand
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        // Check if zone name already exists for this brand
        if (zoneRepository.existsByZoneNameAndBrandAndIsActiveTrue(zone.getZoneName(), brand)) {
            throw new RuntimeException("Zone name already exists for this brand");
        }

        // Set brand and timestamps
        zone.setBrand(brand);
        zone.setCreatedAt(LocalDateTime.now());
        zone.setUpdatedAt(LocalDateTime.now());
        zone.setActive(true);

        return zoneRepository.save(zone);
    }

    // Update zone
    public Zone updateZone(Long zoneId, Zone updatedZone, Long brandId) {
        Zone existingZone = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new RuntimeException("Zone not found"));

        // Find and set the brand
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        // Check if updated zone name already exists for another zone with the same brand
        Optional<Zone> zoneWithSameName = zoneRepository.findByZoneNameAndBrandAndIsActiveTrue(
                updatedZone.getZoneName(), brand);
        if (zoneWithSameName.isPresent() && !zoneWithSameName.get().getZoneId().equals(zoneId)) {
            throw new RuntimeException("Zone name already exists for this brand");
        }

        // Update zone details
        existingZone.setZoneName(updatedZone.getZoneName());
        existingZone.setBrand(brand);
        existingZone.setUpdatedAt(LocalDateTime.now());

        return zoneRepository.save(existingZone);
    }

    // Delete zone (soft delete)
    public void deleteZone(Long zoneId) {
        Zone zone = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new RuntimeException("Zone not found"));

        // Soft delete the zone
        zone.setActive(false);
        zone.setUpdatedAt(LocalDateTime.now());
        zoneRepository.save(zone);
    }

    // Get total zone count
    public long getZoneCount() {
        return zoneRepository.countByIsActiveTrue();
    }
}