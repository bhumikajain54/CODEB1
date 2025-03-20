package com.example.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Group;
import com.example.demo.Repository.GroupRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<Group> getGroupById(Long groupId) {
        return groupRepository.findById(groupId);
    }

    public Group addGroup(Group group) {
        if (groupRepository.findByGroupName(group.getGroupName()).isPresent()) {
            throw new RuntimeException("Group name must be unique.");
        }
        group.setCreatedAt(LocalDateTime.now());
        group.setUpdatedAt(LocalDateTime.now());
        return groupRepository.save(group);
    }

    public Group updateGroup(Long id, String newName) {
        Optional<Group> groupOptional = groupRepository.findById(id);
        if (groupOptional.isPresent()) {
            Group group = groupOptional.get();
            group.setGroupName(newName);
            return groupRepository.save(group);
        } else {
            throw new RuntimeException("Group not found");
        }
    }

    // ✅ Fix Soft Delete (Instead of Permanent Delete)
//    public void softDeleteGroup(Long id) {
//        Optional<Group> groupOptional = groupRepository.findById(id);
//        if (groupOptional.isPresent()) {
//            Group group = groupOptional.get();
//            group.setDeleted(true); // Set "deleted" flag instead of removing
//            groupRepository.save(group);
//        } else {
//            throw new RuntimeException("Group not found");
//        }
//    }
    public void  softDeleteGroup(Long id) {
        Optional<Group> existingGroupOpt = groupRepository.findById(id);
        if (existingGroupOpt.isEmpty()) {
            throw new IllegalArgumentException("Group not found.");
        }

        Group group = existingGroupOpt.get();
        group.setActive(false);
        groupRepository.save(group);
        }

}