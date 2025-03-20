package com.example.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Brand;
import com.example.demo.Entity.Chain;
import com.example.demo.Entity.Group;
import com.example.demo.Repository.BrandRepository;
import com.example.demo.Repository.ChainRepository;
import com.example.demo.Repository.GroupRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ChainRepository chainRepository;

    @Autowired
    private GroupRepository groupRepository;

    // Get all active brands
    public List<Brand> getAllBrands() {
        return brandRepository.findByIsActiveTrue();
    }

    // Get brands by chain id
    public List<Brand> getBrandsByChain(Long chainId) {
        Optional<Chain> chain = chainRepository.findById(chainId);
        if (chain.isPresent()) {
            return brandRepository.findByChainAndIsActiveTrue(chain.get());
        }
        throw new RuntimeException("Chain not found");
    }

    // Get brands by group id
    public List<Brand> getBrandsByGroup(Long groupId) {
        Optional<Group> group = groupRepository.findById(groupId);
        if (group.isPresent()) {
            return brandRepository.findByChain_GroupAndIsActiveTrue(group.get());
        }
        throw new RuntimeException("Group not found");
    }

    // Get brand by id
    public Optional<Brand> getBrandById(Long brandId) {
        return brandRepository.findById(brandId);
    }

    // Add new brand
    public Brand addBrand(Brand brand, Long chainId) {
        // Find and set the chain
        Chain chain = chainRepository.findById(chainId)
                .orElseThrow(() -> new RuntimeException("Chain not found"));

        // Check if brand name already exists for this chain
        Optional<Brand> existingBrand = brandRepository.findByBrandNameAndChainAndIsActiveTrue(
                brand.getBrandName(), chain);
        if (existingBrand.isPresent()) {
            throw new RuntimeException("Brand name already exists for this company");
        }

        // Set chain and timestamps
        brand.setChain(chain);
        brand.setCreatedAt(LocalDateTime.now());
        brand.setUpdatedAt(LocalDateTime.now());
        brand.setActive(true);

        return brandRepository.save(brand);
    }

    // Update brand
    public Brand updateBrand(Long brandId, Brand updatedBrand, Long chainId) {
        Brand existingBrand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        // Find and set the chain
        Chain chain = chainRepository.findById(chainId)
                .orElseThrow(() -> new RuntimeException("Chain not found"));

        // Check if updated brand name already exists for another brand with the same chain
        Optional<Brand> brandWithSameName = brandRepository.findByBrandNameAndChainAndIsActiveTrue(
                updatedBrand.getBrandName(), chain);
        if (brandWithSameName.isPresent() && !brandWithSameName.get().getBrandId().equals(brandId)) {
            throw new RuntimeException("Brand name already exists for this company");
        }

        // Update brand details
        existingBrand.setBrandName(updatedBrand.getBrandName());
        existingBrand.setChain(chain);
        existingBrand.setUpdatedAt(LocalDateTime.now());

        return brandRepository.save(existingBrand);
    }

    // Delete brand (soft delete)
    public void deleteBrand(Long brandId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        // Check if brand is linked to any zone
        // This would need a ZoneRepository to check - using a placeholder check for now
        boolean isLinkedToZone = false; // Replace with actual check

        if (isLinkedToZone) {
            throw new RuntimeException("Cannot delete brand as it is associated with zones");
        }

        // Soft delete the brand
        brand.setActive(false);
        brand.setUpdatedAt(LocalDateTime.now());
        brandRepository.save(brand);
    }

    // Check if brand can be deleted
    public boolean canDeleteBrand(Long brandId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        // Check if brand is linked to any zone
        // This would need a ZoneRepository to check - using a placeholder for now
        boolean isLinkedToZone = false; // Replace with actual check

        return !isLinkedToZone;
    }

    // Get total brand count
    public long getBrandCount() {
        return brandRepository.countByIsActiveTrue();
    }
}