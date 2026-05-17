package com.irvins.backend.repository;

import com.irvins.backend.entity.ComplaintCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplaintCategoryRepository extends JpaRepository<ComplaintCategory, Long> {
    ComplaintCategory findByMainCategory(String mainCategory);
    boolean existsByMainCategory(String mainCategory);
}