//package com.example.demo.Controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import com.example.demo.Entity.Group;
//import com.example.demo.Services.GroupService;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/groups")
//@CrossOrigin(origins = "*") // Allow React frontend
//public class GroupController {
//
//    @Autowired
//    private GroupService groupService;
//
//    @GetMapping
//    public List<Group> getAllGroups() {
//        return groupService.getAllGroups();
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<?> getGroupById(@PathVariable Long id) {
//        // Check if id is null or invalid
//        if (id == null) {
//            return ResponseEntity.badRequest().body("Invalid group ID: null");
//        }
//
//        Optional<Group> group = groupService.getGroupById(id);
//        if (group.isPresent()) {
//            return ResponseEntity.ok(group.get());
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @PostMapping
//    public ResponseEntity<?> createGroup(@RequestBody Group group) {
//        if (group.getGroupName() == null || group.getGroupName().trim().isEmpty()) {
//            return ResponseEntity.badRequest().body("Group name cannot be empty");
//        }
//        Group savedGroup = groupService.addGroup(group);
//        return ResponseEntity.ok(savedGroup);
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<?> updateGroup(@PathVariable Long id, @RequestBody String newName) {
//        // Check if id is null or invalid
//        if (id == null) {
//            return ResponseEntity.badRequest().body("Invalid group ID: null");
//        }
//
//        try {
//            Group updatedGroup = groupService.updateGroup(id, newName);
//            return ResponseEntity.ok(updatedGroup);
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
//        // Check if id is null or invalid
//        if (id == null) {
//            return ResponseEntity.badRequest().body("Invalid group ID: null");
//        }
//
//        try {
//            groupService.softDeleteGroup(id);
//            return ResponseEntity.ok("Group deleted successfully");
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//}

package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Group;
import com.example.demo.Services.GroupService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*") // Allow React frontend
public class GroupController {

    @Autowired
    private GroupService groupService;

    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGroupById(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().body("Invalid group ID: null");
        }

        Optional<Group> group = groupService.getGroupById(id);
        if (group.isPresent()) {
            return ResponseEntity.ok(group.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody Group group) {
        if (group.getGroupName() == null || group.getGroupName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Group name cannot be empty");
        }
        Group savedGroup = groupService.addGroup(group);
        return ResponseEntity.ok(savedGroup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroup(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        if (id == null) {
            return ResponseEntity.badRequest().body("Invalid group ID: null");
        }

        String newName = payload.get("groupName");
        if (newName == null || newName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Group name cannot be empty");
        }

        try {
            Group updatedGroup = groupService.updateGroup(id, newName);
            return ResponseEntity.ok(updatedGroup);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().body("Invalid group ID: null");
        }
        try {
            groupService.softDeleteGroup(id);
            return ResponseEntity.ok("Group deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}