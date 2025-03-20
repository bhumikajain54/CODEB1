package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Brand;
import com.example.demo.Services.BrandService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "*")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandService.getAllBrands();
    }

    @GetMapping("/chain/{chainId}")
    public List<Brand> getBrandsByChain(@PathVariable Long chainId) {
        return brandService.getBrandsByChain(chainId);
    }

    @GetMapping("/group/{groupId}")
    public List<Brand> getBrandsByGroup(@PathVariable Long groupId) {
        return brandService.getBrandsByGroup(groupId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBrandById(@PathVariable Long id) {
        return brandService.getBrandById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createBrand(@RequestBody Map<String, Object> requestBody) {
        try {
            String brandName = (String) requestBody.get("brandName");
            Long chainId = Long.parseLong(requestBody.get("chainId").toString());

            Brand brand = new Brand();
            brand.setBrandName(brandName);

            Brand newBrand = brandService.addBrand(brand, chainId);
            return ResponseEntity.ok(newBrand);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateBrand(@PathVariable Long id, @RequestBody Brand brand, @RequestParam Long chainId) {
        try {
            Brand updatedBrand = brandService.updateBrand(id, brand, chainId);
            return ResponseEntity.ok(updatedBrand);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable Long id) {
        try {
            brandService.deleteBrand(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Brand deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/can-delete/{id}")
    public ResponseEntity<Boolean> canDeleteBrand(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.canDeleteBrand(id));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getBrandCount() {
        return ResponseEntity.ok(brandService.getBrandCount());
    }
}