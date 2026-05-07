package com.irvins.backend.repository;

import com.irvins.backend.entity.Master;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;   // 🔴 ADD THIS
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MasterRepository extends JpaRepository<Master, Long> {
        Master findByComplaintNo(String complaintNo);

    @Query("SELECT m FROM Master m WHERE LOWER(m.subject) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.details) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Master> findSimilarBySubject(@Param("keyword") String keyword);  // 🔴 FIX
}