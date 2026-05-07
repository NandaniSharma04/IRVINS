package com.irvins.backend.repository;

import com.irvins.backend.entity.AIComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIComplaintRepository extends JpaRepository<AIComplaint, Long> {

    @Query(value = """
    SELECT 
        id,
        complaint_no,
        subject,
        details,
        sender_name,
        embedding,
        (embedding <=> CAST(:queryVector AS vector)) AS distance
    FROM ai_complaints 
    WHERE embedding IS NOT NULL 
    ORDER BY distance ASC
    LIMIT :k
    """,
    nativeQuery = true)
List<AIComplaint> findTopKByVector(
    @Param("queryVector") String queryVector,
    @Param("k") int k
);
}
