package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Zone;
import com.example.demo.Services.ZoneService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/zones")
@CrossOrigin(origins = "*")
public class ZoneController {

    @Autowired
    private ZoneService zoneService;

    @GetMapping
    public List<Zone> getAllZones() {
        return zoneService.getAllZones();
    }

    @GetMapping("/brand/{brandId}")
    public List<Zone> getZonesByBrand(@PathVariable Long brandId) {
        return zoneService.getZonesByBrand(brandId);
    }

    @GetMapping("/chain/{chainId}")
    public List<Zone> getZonesByChain(@PathVariable Long chainId) {
        return zoneService.getZonesByChain(chainId);
    }

    @GetMapping("/group/{groupId}")
    public List<Zone> getZonesByGroup(@PathVariable Long groupId) {
        return zoneService.getZonesByGroup(groupId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getZoneById(@PathVariable Long id) {
        return zoneService.getZoneById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createZone(@RequestBody Zone zone, @RequestParam Long brandId) {
        try {
            Zone newZone = zoneService.addZone(zone, brandId);
            return ResponseEntity.ok(newZone);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateZone(@PathVariable Long id, @RequestBody Zone zone, @RequestParam Long brandId) {
        try {
            Zone updatedZone = zoneService.updateZone(id, zone, brandId);
            return ResponseEntity.ok(updatedZone);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteZone(@PathVariable Long id) {
        try {
            zoneService.deleteZone(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Zone deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }


    @GetMapping("/count")
    public ResponseEntity<Long> getZoneCount() {
        return ResponseEntity.ok(zoneService.getZoneCount());
    }
}