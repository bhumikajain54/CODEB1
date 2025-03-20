//package com.example.demo.Repository;
//
//import com.example.demo.Entity.Chain;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//
//public interface ChainRepository extends JpaRepository<Chain, Long> {
//    List<Chain> findByGroup_GroupId(Long groupId);
//    boolean existsByGstnNo(String gstnNo);
//}
package com.example.demo.Repository;

import com.example.demo.Entity.Chain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChainRepository extends JpaRepository<Chain, Long> {
    List<Chain> findByGroup_GroupId(Long groupId);
    boolean existsByGstnNo(String gstnNo);

    // Add a query to check if chain is related to any brands
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Brand b WHERE b.chain.chainId = :chainId")
    boolean hasRelatedBrands(@Param("chainId") Long chainId);
}