//package com.example.demo.Controller;
//
//import com.example.demo.Entity.Chain;
//import com.example.demo.Services.ChainService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/chains")
//@CrossOrigin("*")
//public class ChainController {
//
//    private final ChainService chainService;
//
//    public ChainController(ChainService chainService) {
//        this.chainService = chainService;
//    }
//
//    @GetMapping
//    public ResponseEntity<List<Chain>> getAllChains() {
//        return ResponseEntity.ok(chainService.getAllChains());
//    }
//
//    @PostMapping
//    public ResponseEntity<Chain> addChain(@RequestBody Chain chain) {
//        return ResponseEntity.ok(chainService.addChain(chain));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<Optional<Chain>> updateChain(@PathVariable Long id, @RequestBody Chain chain) {
//        return ResponseEntity.ok(chainService.updateChain(id, chain));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteChain(@PathVariable Long id) {
//        chainService.softDeleteChain(id);
//        return ResponseEntity.ok("Chain deleted successfully");
//    }
//}
package com.example.demo.Controller;

import com.example.demo.Entity.Chain;
import com.example.demo.Services.ChainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/chains")
@CrossOrigin("*")
public class ChainController {

    private final ChainService chainService;

    public ChainController(ChainService chainService) {
        this.chainService = chainService;
    }

    @GetMapping
    public ResponseEntity<List<Chain>> getAllChains() {
        return ResponseEntity.ok(chainService.getAllChains());
    }

    @PostMapping
    public ResponseEntity<Chain> addChain(@RequestBody Chain chain) {
        return ResponseEntity.ok(chainService.addChain(chain));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Optional<Chain>> updateChain(@PathVariable Long id, @RequestBody Chain chain) {
        return ResponseEntity.ok(chainService.updateChain(id, chain));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChain(@PathVariable Long id) {
        boolean deleted = chainService.softDeleteChain(id);

        Map<String, Object> response = new HashMap<>();

        if (deleted) {
            response.put("success", true);
            response.put("message", "Chain deleted successfully");
            response.put("redirect", "/dashboard"); // Redirect path for frontend
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Cannot delete chain as it has related brands");
            return ResponseEntity.badRequest().body(response);
        }
    }
}