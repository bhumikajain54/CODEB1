//package com.example.demo.Services;
//
//import com.example.demo.Entity.Chain;
//import com.example.demo.Repository.ChainRepository;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class ChainService {
//
//    private final ChainRepository chainRepository;
//
//    public ChainService(ChainRepository chainRepository) {
//        this.chainRepository = chainRepository;
//    }
//
//    public List<Chain> getAllChains() {
//        return chainRepository.findAll();
//    }
//
//    public List<Chain> getChainsByGroup(Long groupId) {
//        return chainRepository.findByGroup_GroupId(groupId);
//    }
//
//    public Chain addChain(Chain chain) {
//        if (chainRepository.existsByGstnNo(chain.getGstnNo())) {
//            throw new IllegalArgumentException("GSTN already exists!");
//        }
//        return chainRepository.save(chain);
//    }
//
//    public Optional<Chain> updateChain(Long id, Chain updatedChain) {
//        return chainRepository.findById(id).map(chain -> {
//            chain.setCompanyName(updatedChain.getCompanyName());
//            chain.setGstnNo(updatedChain.getGstnNo());
//            chain.setUpdatedAt(updatedChain.getUpdatedAt());
//            return chainRepository.save(chain);
//        });
//    }
//
//    public void softDeleteChain(Long id) {
//        chainRepository.findById(id).ifPresent(chain -> {
//            chain.setActive(false);
//            chainRepository.save(chain);
//        });
//    }
//}
package com.example.demo.Services;

import com.example.demo.Entity.Chain;
import com.example.demo.Repository.ChainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChainService {

    private final ChainRepository chainRepository;

    public ChainService(ChainRepository chainRepository) {
        this.chainRepository = chainRepository;
    }

    public List<Chain> getAllChains() {
        return chainRepository.findAll();
    }

    public List<Chain> getChainsByGroup(Long groupId) {
        return chainRepository.findByGroup_GroupId(groupId);
    }

    public Chain addChain(Chain chain) {
        if (chainRepository.existsByGstnNo(chain.getGstnNo())) {
            throw new IllegalArgumentException("GSTN already exists!");
        }
        return chainRepository.save(chain);
    }

    public Optional<Chain> updateChain(Long id, Chain updatedChain) {
        return chainRepository.findById(id).map(chain -> {
            chain.setCompanyName(updatedChain.getCompanyName());
            chain.setGstnNo(updatedChain.getGstnNo());
            chain.setUpdatedAt(updatedChain.getUpdatedAt());
            return chainRepository.save(chain);
        });
    }

    /**
     * Checks if chain can be deleted and performs soft deletion if possible
     * @param id Chain ID to delete
     * @return true if chain was deleted, false if it couldn't be deleted due to brand relationships
     */
    public boolean softDeleteChain(Long id) {
        Optional<Chain> chainOptional = chainRepository.findById(id);

        if (chainOptional.isPresent()) {
            Chain chain = chainOptional.get();

            // Check if chain has any related brands
            if (chainRepository.hasRelatedBrands(id)) {
                // Cannot delete chain with related brands
                return false;
            }

            // No related brands, proceed with soft delete
            chain.setActive(false);
            chainRepository.save(chain);
            return true;
        }

        return false;
    }
}